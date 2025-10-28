# Nexus MediaSoup Server

Um servidor WebRTC completo usando MediaSoup para comunicação de áudio e vídeo em tempo real.

## 🚀 Funcionalidades

- ✅ Gerenciamento de salas de vídeo
- ✅ Comunicação WebRTC peer-to-peer
- ✅ Suporte a áudio e vídeo
- ✅ Múltiplos codecs (Opus, VP8, H264)
- ✅ Socket.IO para comunicação em tempo real
- ✅ Gerenciamento automático de workers
- ✅ Cleanup automático de recursos

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
```

3. Compile o TypeScript:
```bash
npm run build
```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)
- `PUBLIC_IP`: IP público para produção (padrão: 0.0.0.0)

### Para Produção

1. Configure seu IP público no arquivo `.env`:
```
PUBLIC_IP=seu.ip.publico.aqui
```

2. Certifique-se de que as portas UDP estão abertas no firewall:
   - Portas 10000-20000 (para WebRTC)

## 📡 API Socket.IO

### Eventos do Cliente → Servidor

#### `join-room`
Entra em uma sala
```javascript
socket.emit('join-room', { roomId: 'room1', name: 'João' });
```

#### `create-transport`
Cria um transport WebRTC
```javascript
socket.emit('create-transport', { direction: 'send' });
socket.emit('create-transport', { direction: 'recv' });
```

#### `connect-transport`
Conecta um transport
```javascript
socket.emit('connect-transport', { 
  transportId: 'transport-id', 
  dtlsParameters: dtlsParams 
});
```

#### `produce`
Inicia produção de áudio/vídeo
```javascript
socket.emit('produce', {
  transportId: 'transport-id',
  kind: 'audio', // ou 'video'
  rtpParameters: rtpParams
});
```

#### `consume`
Consome áudio/vídeo de outro peer
```javascript
socket.emit('consume', {
  producerId: 'producer-id',
  transportId: 'transport-id',
  rtpCapabilities: capabilities
});
```

#### `resume-consumer`
Retoma um consumer pausado
```javascript
socket.emit('resume-consumer', { consumerId: 'consumer-id' });
```

#### `get-router-rtp-capabilities`
Obtém as capacidades RTP do router
```javascript
socket.emit('get-router-rtp-capabilities');
```

### Eventos do Servidor → Cliente

#### `room-joined`
Confirmação de entrada na sala
```javascript
socket.on('room-joined', (data) => {
  console.log('Entrou na sala:', data.roomId);
  console.log('Peers na sala:', data.peers);
});
```

#### `peer-joined`
Novo peer entrou na sala
```javascript
socket.on('peer-joined', (peerInfo) => {
  console.log('Novo peer:', peerInfo);
});
```

#### `peer-left`
Peer saiu da sala
```javascript
socket.on('peer-left', (peerInfo) => {
  console.log('Peer saiu:', peerInfo);
});
```

#### `transport-created`
Transport criado com sucesso
```javascript
socket.on('transport-created', (data) => {
  console.log('Transport criado:', data.transportId);
});
```

#### `produced`
Producer criado com sucesso
```javascript
socket.on('produced', (data) => {
  console.log('Producer criado:', data.producerId);
});
```

#### `new-producer`
Novo producer disponível
```javascript
socket.on('new-producer', (data) => {
  console.log('Novo producer:', data.producerId);
});
```

#### `consumed`
Consumer criado com sucesso
```javascript
socket.on('consumed', (data) => {
  console.log('Consumer criado:', data.consumerId);
});
```

#### `error`
Erro ocorrido
```javascript
socket.on('error', (error) => {
  console.error('Erro:', error.message);
});
```

## 🏥 Health Check

O servidor expõe um endpoint de health check:

```
GET http://localhost:3000/health
```

Resposta:
```json
{
  "status": "ok",
  "workers": [
    {
      "index": 0,
      "pid": 12345,
      "uptime": 3600
    }
  ],
  "rooms": 2,
  "clients": 5
}
```

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
src/
├── config.ts          # Configurações do MediaSoup
├── server.ts          # Servidor principal
├── types.ts           # Tipos TypeScript
└── mediasoup/
    ├── index.ts       # Exports
    ├── worker.ts      # Gerenciamento de workers
    ├── room.ts        # Gerenciamento de salas
    └── peer.ts        # Gerenciamento de peers
```

### Adicionando Novos Codecs

Edite `src/config.ts` para adicionar novos codecs de áudio/vídeo:

```typescript
export const routerSettings = {
  mediaCodecs: [
    // Adicione novos codecs aqui
    {
      kind: 'video',
      mimeType: 'video/VP9',
      clockRate: 90000,
      // ... outras configurações
    }
  ]
}
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão WebRTC**: Verifique se o IP público está configurado corretamente
2. **Workers não iniciam**: Verifique se as portas UDP estão disponíveis
3. **Áudio/vídeo não funciona**: Verifique se os codecs estão suportados pelo cliente

### Logs

O servidor produz logs detalhados para debug:
- Conexões de clientes
- Criação de salas e peers
- Erros de WebRTC
- Status dos workers

## 📄 Licença

MIT License
