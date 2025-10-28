# 🔍 Diagnóstico: Peers Não Se Comunicam

## 🚨 Problemas Mais Comuns

### 1. **Problema: Transports não são criados automaticamente**

**Sintoma**: Conecta na sala mas não consegue enviar/receber áudio/vídeo

**Causa**: O frontend não está criando os transports automaticamente após entrar na sala

**Solução**: Adicionar criação automática de transports

### 2. **Problema: Falta de STUN/TURN servers**

**Sintoma**: ICE candidates falham, conexão WebRTC não estabelece

**Causa**: Railway não expõe portas UDP adequadamente

**Solução**: Configurar STUN servers externos

### 3. **Problema: RTP Capabilities não são obtidas**

**Sintoma**: Erro "Cannot consume this producer"

**Causa**: Device não carregou as capacidades RTP do router

**Solução**: Garantir que capabilities são obtidas antes de consumir

### 4. **Problema: Producers não são notificados**

**Sintoma**: Um peer produz mas outros não recebem

**Causa**: Notificação de novos producers não está funcionando

**Solução**: Verificar fluxo de notificação

## 🔧 Correções Necessárias

### Correção 1: Criação Automática de Transports

O frontend precisa criar transports automaticamente após entrar na sala:

```javascript
// Adicionar no evento 'room-joined'
socket.on('room-joined', async (data) => {
    // ... código existente ...
    
    // Criar transports automaticamente
    await this.createSendTransport();
    await this.createRecvTransport();
});

async createSendTransport() {
    return new Promise((resolve, reject) => {
        this.socket.emit('create-transport', { direction: 'send' }, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        });
    });
}

async createRecvTransport() {
    return new Promise((resolve, reject) => {
        this.socket.emit('create-transport', { direction: 'recv' }, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        });
    });
}
```

### Correção 2: Configurar STUN Servers

Adicionar STUN servers no MediaSoup:

```typescript
// No config.ts
export const transportSettings = {
  listenIps: [
    {
      ip: '0.0.0.0',
      announcedIp: process.env.PUBLIC_IP || getRailwayPublicIp() || undefined,
    },
  ],
  
  // Adicionar STUN servers
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],

  enableUdp: true,
  enableTcp: true,
  preferUdp: !isRailwayEnvironment(),
  
  // ... resto da configuração
};
```

### Correção 3: Obter RTP Capabilities Automaticamente

```javascript
// Adicionar após entrar na sala
socket.on('room-joined', async (data) => {
    // ... código existente ...
    
    // Obter RTP capabilities
    this.socket.emit('get-router-rtp-capabilities');
});
```

### Correção 4: Melhorar Notificação de Producers

```typescript
// No server.ts, melhorar a notificação
private notifyNewProducer(producer: mediasoup.types.Producer, peerId: string) {
    for (const [otherPeerId, otherPeer] of this.peers.entries()) {
        if (otherPeerId !== peerId) {
            console.log(`Notifying ${otherPeer.name} about new producer ${producer.id}`);
            
            // Enviar notificação via socket
            const client = this.clients.get(otherPeerId);
            if (client) {
                client.socket.emit('new-producer', {
                    producerId: producer.id,
                    peerId: peerId,
                    kind: producer.kind
                });
            }
        }
    }
}
```

## 🧪 Teste Passo a Passo

### 1. **Teste de Conexão Básica**
- Abra duas abas do navegador
- Conecte ambas na mesma sala
- Verifique se aparecem logs de "Peer joined"

### 2. **Teste de Transports**
- Verifique se os transports são criados
- Procure por logs de "Transport created"

### 3. **Teste de Producers**
- Ative áudio/vídeo em uma aba
- Verifique se aparece "Producer created"
- Verifique se a outra aba recebe "New producer"

### 4. **Teste de Consumers**
- Verifique se consumers são criados
- Procure por logs de "Consumer created"

## 🚨 Sinais de Problemas

### ❌ **Problemas de Conexão**
- "Failed to join room"
- "Transport not found"
- "Peer not found"

### ❌ **Problemas de WebRTC**
- "ICE connection failed"
- "DTLS connection failed"
- "Cannot consume this producer"

### ❌ **Problemas de Mídia**
- Vídeo não aparece
- Áudio não funciona
- "Failed to produce"

## 🎯 Próximos Passos

1. **Implementar as correções acima**
2. **Testar localmente primeiro**
3. **Depois testar no Railway**
4. **Considerar VPS para produção WebRTC**

## 📞 Debugging

Para debugar melhor, adicione logs detalhados:

```javascript
// No frontend
console.log('Socket events:', this.socket.listeners());
console.log('Device loaded:', this.device);
console.log('Transports:', { send: this.sendTransport, recv: this.recvTransport });
console.log('Producers:', this.producers);
console.log('Consumers:', this.consumers);
```
