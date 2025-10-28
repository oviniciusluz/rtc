class MediaSoupClient {
    constructor() {
        this.socket = null;
        this.device = null;
        this.sendTransport = null;
        this.recvTransport = null;
        this.producers = new Map();
        this.consumers = new Map();
        this.localStream = null;
        this.remoteStream = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.detectServerUrl();
    }

    initializeElements() {
        // Connection elements
        this.serverUrlInput = document.getElementById('serverUrl');
        this.roomIdInput = document.getElementById('roomId');
        this.userNameInput = document.getElementById('userName');
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        
        // Status elements
        this.connectionStatus = document.getElementById('connectionStatus');
        this.roomStatus = document.getElementById('roomStatus');
        this.peersStatus = document.getElementById('peersStatus');
        
        // Media elements
        this.startAudioBtn = document.getElementById('startAudioBtn');
        this.stopAudioBtn = document.getElementById('stopAudioBtn');
        this.startVideoBtn = document.getElementById('startVideoBtn');
        this.stopVideoBtn = document.getElementById('stopVideoBtn');
        this.localVideo = document.getElementById('localVideo');
        this.remoteVideo = document.getElementById('remoteVideo');
        
        // Logs
        this.logsContainer = document.getElementById('logs');
        this.clearLogsBtn = document.getElementById('clearLogsBtn');
    }

    setupEventListeners() {
        this.connectBtn.addEventListener('click', () => this.connect());
        this.disconnectBtn.addEventListener('click', () => this.disconnect());
        
        this.startAudioBtn.addEventListener('click', () => this.startAudio());
        this.stopAudioBtn.addEventListener('click', () => this.stopAudio());
        this.startVideoBtn.addEventListener('click', () => this.startVideo());
        this.stopVideoBtn.addEventListener('click', () => this.stopVideo());
        
        this.clearLogsBtn.addEventListener('click', () => this.clearLogs());
    }

    detectServerUrl() {
        // Auto-detect server URL based on current location
        const currentUrl = window.location.origin;
        
        // If we're on Railway or production, use the current URL
        if (currentUrl.includes('railway.app') || currentUrl.includes('herokuapp.com') || currentUrl.includes('vercel.app')) {
            this.serverUrlInput.value = currentUrl;
            this.log(`URL do servidor detectada automaticamente: ${currentUrl}`, 'info');
        } else {
            // For local development, use localhost:3000
            this.serverUrlInput.value = 'http://localhost:3000';
        }
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        this.logsContainer.appendChild(logEntry);
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    clearLogs() {
        this.logsContainer.innerHTML = '';
    }

    updateStatus(element, text, className) {
        element.textContent = text;
        element.className = `status ${className}`;
    }

    async connect() {
        try {
            const serverUrl = this.serverUrlInput.value.trim();
            const roomId = this.roomIdInput.value.trim();
            const userName = this.userNameInput.value.trim();

            if (!serverUrl || !roomId || !userName) {
                this.log('Preencha todos os campos', 'error');
                return;
            }

            this.updateStatus(this.connectionStatus, 'Conectando...', 'connecting');
            this.connectBtn.disabled = true;

            // Conectar ao Socket.IO
            this.socket = io(serverUrl);
            this.setupSocketListeners();

            // Aguardar conexão
            await new Promise((resolve, reject) => {
                this.socket.on('connect', resolve);
                this.socket.on('connect_error', reject);
            });

            this.log('Conectado ao servidor', 'success');
            this.updateStatus(this.connectionStatus, 'Conectado', 'connected');
            this.disconnectBtn.disabled = false;

            // Entrar na sala
            this.socket.emit('join-room', { roomId, name: userName });

        } catch (error) {
            this.log(`Erro ao conectar: ${error.message}`, 'error');
            this.updateStatus(this.connectionStatus, 'Erro de conexão', 'disconnected');
            this.connectBtn.disabled = false;
        }
    }

    setupSocketListeners() {
        this.      socket.on('room-joined', async (data) => {
          this.log(`Entrou na sala: ${data.roomId}`, 'success');
          this.updateStatus(this.roomStatus, `Conectado à sala: ${data.roomId}`, 'connected');
          this.updateStatus(this.peersStatus, `${data.peers.length} peers na sala`, 'connected');
          
          // Obter RTP capabilities primeiro
          this.socket.emit('get-router-rtp-capabilities');
          
          // Habilitar controles de mídia
          this.startAudioBtn.disabled = false;
          this.startVideoBtn.disabled = false;
      });

        this.socket.on('peer-joined', (peerInfo) => {
            this.log(`Novo peer conectado: ${peerInfo.name}`, 'info');
        });

        this.socket.on('peer-left', (peerInfo) => {
            this.log(`Peer desconectado: ${peerInfo.name}`, 'warn');
        });

        this.socket.on('transport-created', (data) => {
            this.log(`Transport criado: ${data.direction}`, 'info');
            this.handleTransportCreated(data);
        });

        this.socket.on('transport-connected', (data) => {
            this.log(`Transport conectado: ${data.transportId}`, 'success');
        });

        this.socket.on('produced', (data) => {
            this.log(`Producer criado: ${data.kind}`, 'success');
        });

        this.socket.on('new-producer', (data) => {
            this.log(`Novo producer disponível: ${data.kind}`, 'info');
            this.handleNewProducer(data);
        });

        this.socket.on('consumed', (data) => {
            this.log(`Consumer criado: ${data.kind}`, 'success');
            this.handleConsumerCreated(data);
        });

        this.socket.on('consumer-resumed', (data) => {
            this.log(`Consumer retomado: ${data.consumerId}`, 'success');
        });

        this.socket.on('router-rtp-capabilities', (capabilities) => {
            this.log('Capacidades RTP recebidas', 'info');
            this.handleRouterCapabilities(capabilities);
        });

        this.socket.on('error', (error) => {
            this.log(`Erro: ${error.message}`, 'error');
        });

        this.socket.on('disconnect', () => {
            this.log('Desconectado do servidor', 'warn');
            this.handleDisconnect();
        });
    }

    async handleRouterCapabilities(capabilities) {
        try {
            // Verificar se MediaSoup Client está disponível
            if (typeof mediasoupClient === 'undefined') {
                this.log('MediaSoup Client não está disponível! Recarregue a página.', 'error');
                return;
            }
            
            this.device = new mediasoupClient.Device();
            await this.device.load({ routerRtpCapabilities: capabilities });
            this.log('Device carregado com sucesso', 'success');
            
            // Criar transports automaticamente após carregar o device
            this.log('Criando transport de envio...', 'info');
            await this.createSendTransport();
            this.log('Transport de envio criado', 'success');
            
            this.log('Criando transport de recepção...', 'info');
            await this.createRecvTransport();
            this.log('Transport de recepção criado', 'success');
            
        } catch (error) {
            this.log(`Erro ao carregar device: ${error.message}`, 'error');
        }
    }

    async createSendTransport() {
        return new Promise((resolve, reject) => {
            this.socket.emit('create-transport', { direction: 'send' });
            
            // Aguardar resposta via evento
            const timeout = setTimeout(() => {
                reject(new Error('Timeout creating send transport'));
            }, 5000);
            
            this.socket.once('transport-created', (data) => {
                if (data.direction === 'send') {
                    clearTimeout(timeout);
                    this.handleTransportCreated(data);
                    resolve(data);
                }
            });
        });
    }

    async createRecvTransport() {
        return new Promise((resolve, reject) => {
            this.socket.emit('create-transport', { direction: 'recv' });
            
            // Aguardar resposta via evento
            const timeout = setTimeout(() => {
                reject(new Error('Timeout creating recv transport'));
            }, 5000);
            
            this.socket.once('transport-created', (data) => {
                if (data.direction === 'recv') {
                    clearTimeout(timeout);
                    this.handleTransportCreated(data);
                    resolve(data);
                }
            });
        });
    }

    async createTransport(direction) {
        return new Promise((resolve, reject) => {
            this.socket.emit('create-transport', { direction }, (error, data) => {
                if (error) {
                    reject(new Error(error.message));
                    return;
                }
                resolve(data);
            });
        });
    }

    async handleTransportCreated(data) {
        try {
            this.log(`Configurando transport ${data.direction}...`, 'info');
            
            let mediasoupTransport;
            if (data.direction === 'send') {
                mediasoupTransport = this.device.createSendTransport(data);
                this.sendTransport = mediasoupTransport;
                this.log('Send transport configurado', 'success');
            } else {
                mediasoupTransport = this.device.createRecvTransport(data);
                this.recvTransport = mediasoupTransport;
                this.log('Recv transport configurado', 'success');
            }

            mediasoupTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
                this.log(`Conectando transport ${data.direction}...`, 'info');
                this.socket.emit('connect-transport', {
                    transportId: data.transportId,
                    dtlsParameters
                });
                
                // Aguardar confirmação via evento
                this.socket.once('transport-connected', (response) => {
                    if (response.transportId === data.transportId) {
                        this.log(`Transport ${data.direction} conectado`, 'success');
                        callback();
                    }
                });
            });

            if (data.direction === 'send') {
                mediasoupTransport.on('produce', ({ kind, rtpParameters }, callback, errback) => {
                    this.log(`Produzindo ${kind}...`, 'info');
                    this.socket.emit('produce', {
                        transportId: data.transportId,
                        kind,
                        rtpParameters
                    });
                    
                    // Aguardar confirmação via evento
                    this.socket.once('produced', (response) => {
                        if (response.kind === kind) {
                            this.log(`${kind} produzido com sucesso`, 'success');
                            callback({ id: response.producerId });
                        }
                    });
                });
            }

            this.log(`Transport ${data.direction} configurado completamente`, 'success');
        } catch (error) {
            this.log(`Erro ao configurar transport: ${error.message}`, 'error');
        }
    }

    async startAudio() {
        try {
            if (!this.sendTransport) {
                this.log('Transport de envio não disponível', 'error');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.localStream = stream;

            const audioTrack = stream.getAudioTracks()[0];
            const producer = await this.sendTransport.produce({ track: audioTrack });
            
            this.producers.set('audio', producer);
            this.log('Áudio iniciado', 'success');
            
            this.startAudioBtn.disabled = true;
            this.stopAudioBtn.disabled = false;
        } catch (error) {
            this.log(`Erro ao iniciar áudio: ${error.message}`, 'error');
        }
    }

    async stopAudio() {
        try {
            const producer = this.producers.get('audio');
            if (producer) {
                producer.close();
                this.producers.delete('audio');
            }

            if (this.localStream) {
                const audioTrack = this.localStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.stop();
                }
            }

            this.log('Áudio parado', 'success');
            this.startAudioBtn.disabled = false;
            this.stopAudioBtn.disabled = true;
        } catch (error) {
            this.log(`Erro ao parar áudio: ${error.message}`, 'error');
        }
    }

    async startVideo() {
        try {
            if (!this.sendTransport) {
                this.log('Transport de envio não disponível', 'error');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (this.localStream) {
                // Adicionar vídeo ao stream existente
                stream.getVideoTracks().forEach(track => {
                    this.localStream.addTrack(track);
                });
            } else {
                this.localStream = stream;
            }

            this.localVideo.srcObject = this.localStream;

            const videoTrack = stream.getVideoTracks()[0];
            const producer = await this.sendTransport.produce({ track: videoTrack });
            
            this.producers.set('video', producer);
            this.log('Vídeo iniciado', 'success');
            
            this.startVideoBtn.disabled = true;
            this.stopVideoBtn.disabled = false;
        } catch (error) {
            this.log(`Erro ao iniciar vídeo: ${error.message}`, 'error');
        }
    }

    async stopVideo() {
        try {
            const producer = this.producers.get('video');
            if (producer) {
                producer.close();
                this.producers.delete('video');
            }

            if (this.localStream) {
                const videoTrack = this.localStream.getVideoTracks()[0];
                if (videoTrack) {
                    videoTrack.stop();
                }
            }

            this.localVideo.srcObject = null;
            this.log('Vídeo parado', 'success');
            this.startVideoBtn.disabled = false;
            this.stopVideoBtn.disabled = true;
        } catch (error) {
            this.log(`Erro ao parar vídeo: ${error.message}`, 'error');
        }
    }

    async handleNewProducer(data) {
        try {
            if (!this.recvTransport) {
                this.log('Transport de recepção não disponível', 'error');
                return;
            }

            this.socket.emit('consume', {
                producerId: data.producerId,
                transportId: this.recvTransport.id,
                rtpCapabilities: this.device.rtpCapabilities
            });
        } catch (error) {
            this.log(`Erro ao consumir producer: ${error.message}`, 'error');
        }
    }

    async handleConsumerCreated(data) {
        try {
            const consumer = await this.recvTransport.consume({
                id: data.consumerId,
                producerId: data.producerId,
                kind: data.kind,
                rtpParameters: data.rtpParameters
            });

            this.consumers.set(data.consumerId, consumer);

            if (data.kind === 'video') {
                const stream = new MediaStream([consumer.track]);
                this.remoteVideo.srcObject = stream;
            }

            this.socket.emit('resume-consumer', { consumerId: data.consumerId });
            this.log(`Consumer ${data.kind} criado e retomado`, 'success');
        } catch (error) {
            this.log(`Erro ao criar consumer: ${error.message}`, 'error');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.handleDisconnect();
    }

    handleDisconnect() {
        // Limpar recursos
        this.producers.forEach(producer => producer.close());
        this.consumers.forEach(consumer => consumer.close());
        
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        this.localVideo.srcObject = null;
        this.remoteVideo.srcObject = null;

        // Resetar estado
        this.producers.clear();
        this.consumers.clear();
        this.sendTransport = null;
        this.recvTransport = null;
        this.device = null;
        this.localStream = null;

        // Atualizar UI
        this.updateStatus(this.connectionStatus, 'Desconectado', 'disconnected');
        this.updateStatus(this.roomStatus, 'Não conectado à sala', 'disconnected');
        this.updateStatus(this.peersStatus, '0 peers na sala', 'disconnected');
        
        this.connectBtn.disabled = false;
        this.disconnectBtn.disabled = true;
        this.startAudioBtn.disabled = true;
        this.stopAudioBtn.disabled = true;
        this.startVideoBtn.disabled = true;
        this.stopVideoBtn.disabled = true;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.client = new MediaSoupClient();
});
