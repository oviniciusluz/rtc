# 🌐 Configuração para Acesso em Rede Local

## 📋 Passos para Expor o Servidor

### 1. **Iniciar o Servidor para Rede**
```bash
npm run start:network
```

### 2. **Seu IP na Rede Local**
Baseado na configuração atual, seu IP é: **192.168.118.3**

### 3. **URLs de Acesso**
- **Você (local):** http://localhost:3000
- **Seu amigo (rede):** http://192.168.118.3:3000

## 🔧 Configuração do Firewall (Windows)

### Opção 1: Via Interface Gráfica
1. Abra o **Windows Defender Firewall**
2. Clique em **"Permitir um aplicativo ou recurso através do firewall"**
3. Clique em **"Alterar configurações"**
4. Clique em **"Permitir outro aplicativo..."**
5. Navegue até o Node.js (geralmente em `C:\Program Files\nodejs\node.exe`)
6. Marque **"Privado"** e **"Público"**
7. Clique em **"OK"**

### Opção 2: Via PowerShell (Como Administrador)
```powershell
# Permitir Node.js através do firewall
New-NetFirewallRule -DisplayName "Node.js Chat Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

# Verificar se a regra foi criada
Get-NetFirewallRule -DisplayName "Node.js Chat Server"
```

### Opção 3: Via Prompt de Comando (Como Administrador)
```cmd
netsh advfirewall firewall add rule name="Node.js Chat Server" dir=in action=allow protocol=TCP localport=3000
```

## 🧪 Testando a Conexão

### 1. **Teste Local**
- Acesse: http://localhost:3000
- Deve funcionar normalmente

### 2. **Teste de Rede**
- Acesse: http://192.168.118.3:3000
- Deve carregar a mesma página

### 3. **Teste com Amigo**
- Seu amigo deve acessar: http://192.168.118.3:3000
- Ambos devem conseguir conversar e fazer chamadas de vídeo

## 🔍 Solução de Problemas

### ❌ "Não é possível acessar o site"
**Possíveis causas:**
1. **Firewall bloqueando** - Configure o firewall conforme instruções acima
2. **IP mudou** - Execute `ipconfig` novamente para verificar o IP
3. **Servidor não está rodando** - Verifique se o servidor está ativo

### ❌ "Conexão recusada"
**Soluções:**
1. Verifique se o servidor está rodando na porta 3000
2. Confirme que ambos estão na mesma rede Wi-Fi
3. Teste com `telnet 192.168.118.3 3000` (se disponível)

### ❌ "Chamadas de vídeo não funcionam"
**Possíveis causas:**
1. **NAT/Firewall** - WebRTC pode ter problemas com NAT
2. **STUN servers** - O sistema usa servidores STUN públicos do Google
3. **Permissões de câmera/microfone** - Verifique se foram concedidas

## 🌍 Acesso Externo (Internet)

### Para acessar de qualquer lugar (não apenas rede local):

#### Opção 1: ngrok (Mais Fácil)
```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3000
ngrok http 3000
```
- ngrok criará uma URL pública (ex: https://abc123.ngrok.io)
- Compartilhe essa URL com seu amigo

#### Opção 2: Configurar Roteador
1. Acesse o painel do roteador (geralmente 192.168.1.1 ou 192.168.0.1)
2. Configure **Port Forwarding** para porta 3000
3. Use seu IP público (verifique em whatismyip.com)

## 📱 Testando em Dispositivos Móveis

### Android/iOS
- Acesse a URL da rede no navegador móvel
- Funciona normalmente, incluindo chamadas de vídeo
- Certifique-se de permitir acesso à câmera/microfone

## 🔒 Considerações de Segurança

⚠️ **Atenção:** Expor o servidor na rede local é seguro, mas:
- Não exponha na internet sem autenticação
- Use HTTPS em produção
- Configure CORS adequadamente
- Implemente rate limiting se necessário

## 📞 Suporte

Se tiver problemas:
1. Verifique se ambos estão na mesma rede
2. Teste o firewall
3. Confirme o IP com `ipconfig`
4. Verifique se o servidor está rodando
