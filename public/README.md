# 🎥 Frontend MediaSoup Test

Interface web para testar o servidor MediaSoup com funcionalidades completas de WebRTC.

## 🚀 Como Usar

1. **Certifique-se que o servidor está rodando:**
```bash
npm run dev
```

2. **Abra o navegador e acesse:**
```
http://localhost:3000
```

3. **Configure a conexão:**
   - URL do Servidor: `http://localhost:3000` (padrão)
   - ID da Sala: `test-room` (padrão)
   - Seu Nome: `Usuário` (padrão)

4. **Clique em "Conectar"**

5. **Teste as funcionalidades:**
   - 🎤 **Iniciar Áudio**: Ativa o microfone
   - 📹 **Iniciar Vídeo**: Ativa a câmera
   - 🔇 **Parar Áudio**: Desativa o microfone
   - 📷 **Parar Vídeo**: Desativa a câmera

## 🧪 Testando com Múltiplos Usuários

Para testar a comunicação entre usuários:

1. **Abra duas abas/janelas do navegador**
2. **Configure nomes diferentes** (ex: "João" e "Maria")
3. **Use o mesmo ID de sala** (ex: "test-room")
4. **Conecte ambos**
5. **Ative áudio/vídeo em ambos**
6. **Você deve ver o vídeo do outro usuário**

## 📱 Funcionalidades

### ✅ **Conexão**
- Conectar/desconectar do servidor
- Entrar em salas específicas
- Status de conexão em tempo real

### ✅ **Áudio**
- Captura de microfone
- Transmissão de áudio
- Recepção de áudio de outros usuários

### ✅ **Vídeo**
- Captura de câmera
- Transmissão de vídeo
- Recepção de vídeo de outros usuários
- Preview local e remoto

### ✅ **Interface**
- Design responsivo
- Logs em tempo real
- Status visual da conexão
- Controles intuitivos

### ✅ **Logs**
- Logs detalhados de todas as operações
- Cores diferentes para tipos de log:
  - 🟢 **Verde**: Sucesso
  - 🔵 **Azul**: Informação
  - 🟡 **Amarelo**: Aviso
  - 🔴 **Vermelho**: Erro

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos e design responsivo
- **JavaScript ES6+**: Lógica do cliente
- **Socket.IO Client**: Comunicação com servidor
- **MediaSoup Client**: WebRTC
- **MediaDevices API**: Acesso à câmera/microfone

## 🐛 Troubleshooting

### **Erro de Conexão**
- Verifique se o servidor está rodando
- Confirme a URL do servidor
- Verifique se as portas estão abertas

### **Erro de Permissões**
- Permita acesso à câmera/microfone
- Use HTTPS em produção
- Verifique as permissões do navegador

### **Áudio/Vídeo Não Funciona**
- Verifique se o dispositivo tem câmera/microfone
- Confirme as permissões do navegador
- Teste em outro navegador

### **Não Recebe Vídeo de Outros Usuários**
- Verifique se ambos estão na mesma sala
- Confirme se ambos ativaram o vídeo
- Verifique os logs para erros

## 📊 Monitoramento

O painel de status mostra:
- **Status da Conexão**: Conectado/Desconectado
- **Status da Sala**: Sala atual
- **Peers na Sala**: Número de usuários conectados

## 🎯 Próximos Passos

Para usar em produção:
1. Configure HTTPS
2. Use um servidor com IP público
3. Configure firewall para portas UDP
4. Implemente autenticação
5. Adicione mais funcionalidades (chat, gravação, etc.)

## 📄 Estrutura dos Arquivos

```
public/
├── index.html      # Página principal
├── style.css       # Estilos
└── app.js          # Lógica JavaScript
```

## 🔗 Links Úteis

- [MediaSoup Documentation](https://mediasoup.org/documentation/)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
