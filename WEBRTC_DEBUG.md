# 🔧 Debug WebRTC - Solução de Problemas

## 🎯 Problema: Vídeo não aparece do outro usuário

### **Sintomas:**
- ✅ Mensagens funcionam
- ✅ Sua câmera aparece
- ❌ Vídeo do outro usuário não aparece
- ❌ Áudio não funciona

## 🔍 Como Diagnosticar

### **1. Abrir Console do Navegador**
- **Chrome/Edge:** F12 → Console
- **Firefox:** F12 → Console
- **Safari:** Cmd+Option+I → Console

### **2. Procurar por Logs WebRTC**
Procure por estas mensagens:
```
🎬 Iniciando processo de chamada...
📊 Configuração WebRTC: {...}
📤 Criando offer...
✅ Offer criado: {...}
🧊 ICE candidate local: {...}
📥 Recebendo offer de: [usuário]
✅ Remote description definida
📤 Answer enviada para: [usuário]
🧊 ICE connection state: connected
🎥 Stream remoto recebido: {...}
```

### **3. Testar Conectividade**
- Clique no botão "🧪 Testar WebRTC"
- Verifique se aparecem logs de ICE candidates
- Se não aparecer, há problema de conectividade

## 🚨 Problemas Comuns e Soluções

### **❌ "ICE connection state: failed"**

**Causa:** NAT/Firewall bloqueando conexão peer-to-peer

**Soluções:**
1. **Usar TURN servers** (já implementado)
2. **Testar em rede diferente** (móvel vs Wi-Fi)
3. **Verificar firewall** do roteador
4. **Usar VPN** para contornar NAT

### **❌ "No ICE candidates"**

**Causa:** STUN servers não acessíveis

**Soluções:**
1. **Verificar conectividade** com STUN servers
2. **Testar em rede diferente**
3. **Usar TURN servers** (já configurado)

### **❌ "Remote description not set"**

**Causa:** Offer/Answer não chegando

**Soluções:**
1. **Verificar logs do servidor** (Railway)
2. **Confirmar que ambos estão conectados**
3. **Recarregar página** e tentar novamente

### **❌ "Stream remoto não recebido"**

**Causa:** Peer connection não estabelecida

**Soluções:**
1. **Aguardar mais tempo** (pode demorar 10-30 segundos)
2. **Verificar se ambos têm câmera/microfone**
3. **Testar em navegador diferente**

## 🛠️ Soluções Avançadas

### **1. Configurar TURN Server Próprio**

Se os TURN públicos não funcionarem:

```javascript
// Adicionar ao rtcConfiguration
{
    urls: 'turn:seu-servidor-turn.com:3478',
    username: 'usuario',
    credential: 'senha'
}
```

### **2. Usar Serviços de TURN**

- **Xirsys:** Serviço pago de TURN
- **Twilio STUN/TURN:** Serviço confiável
- **OpenRelay:** TURN público (já configurado)

### **3. Configurar Roteador**

Para redes locais:
- **UPnP:** Habilitar no roteador
- **Port Forwarding:** Portas 3478, 5349
- **DMZ:** Colocar dispositivo em DMZ (não recomendado)

## 📊 Logs Importantes

### **Cliente (Navegador):**
```javascript
// Verificar se aparecem:
🎬 Iniciando processo de chamada...
🧊 ICE candidate local: {...}
📥 Recebendo offer de: [usuário]
🎥 Stream remoto recebido: {...}
🔗 Estado da conexão: connected
```

### **Servidor (Railway):**
```javascript
// Verificar se aparecem:
📤 Enviando offer de [usuário1] para [usuário2]
📤 Enviando answer de [usuário2] para [usuário1]
🧊 Enviando ICE candidate de [usuário1] para [usuário2]
```

## 🧪 Testes Recomendados

### **1. Teste Local**
- Abrir duas abas do mesmo navegador
- Testar chamada entre as abas
- Se funcionar, problema é de rede

### **2. Teste de Rede**
- Usar dispositivos em redes diferentes
- Testar com dados móveis vs Wi-Fi
- Verificar se funciona em redes públicas

### **3. Teste de Navegador**
- Testar em Chrome, Firefox, Safari
- Verificar se funciona em todos
- Usar versões atualizadas

## 🎯 Soluções por Ambiente

### **Desenvolvimento Local:**
- Usar `localhost` ou IP local
- Configurar firewall se necessário
- Testar com dois dispositivos na mesma rede

### **Railway (Produção):**
- HTTPS automático (bom para WebRTC)
- TURN servers públicos configurados
- Logs disponíveis no painel do Railway

### **Outras Plataformas:**
- **Heroku:** Similar ao Railway
- **Vercel:** Pode ter limitações com WebRTC
- **Netlify:** Não recomendado para WebRTC

## 📞 Suporte

Se nada funcionar:
1. **Verificar logs** completos
2. **Testar em ambiente diferente**
3. **Usar TURN server próprio**
4. **Considerar alternativas** (WebRTC não funciona em todas as redes)

---

**💡 Dica:** WebRTC é complexo e depende muito da rede. Em produção, considere usar serviços como Agora, Twilio ou Daily.co para maior confiabilidade.
