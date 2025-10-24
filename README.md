# Chat Server com Socket.IO

Um servidor de chat em tempo real construído com Express.js e Socket.IO, baseado na [documentação oficial do Socket.IO](https://socket.io/pt-br/docs/v4/server-installation/).

## 🚀 Funcionalidades

- **Chat em tempo real** com WebSockets
- **Mensagens públicas** para todos os usuários
- **Mensagens privadas** entre usuários específicos
- **Chamadas de vídeo** com WebRTC (peer-to-peer)
- **Controles de vídeo** (ligar/desligar câmera e microfone)
- **Indicador de digitação** em tempo real
- **Lista de usuários online** com botões de chamada
- **Interface moderna e responsiva**
- **Notificações de entrada/saída** de usuários
- **Sinalização WebRTC** via Socket.IO

## 📋 Pré-requisitos

- Node.js (versão 10 ou superior)
- npm ou yarn

## 🛠️ Instalação

### **Desenvolvimento Local:**

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar o servidor:**
```bash
npm start
```

3. **Para desenvolvimento (com auto-reload):**
```bash
npm run dev
```

### **Deploy no Railway (Produção):**

1. **Fazer fork/clone do repositório**
2. **Conectar ao Railway:**
   - Acesse [railway.app](https://railway.app)
   - Conecte sua conta GitHub
   - Clique em "New Project" → "Deploy from GitHub repo"
   - Selecione este repositório

3. **Configuração automática:**
   - Railway detectará automaticamente o `package.json`
   - Usará o comando `npm start` para iniciar
   - Gerará URL HTTPS automaticamente

4. **Acessar:**
   - Railway fornecerá uma URL como: `https://seu-projeto.railway.app`
   - Compartilhe essa URL com seus amigos
   - Funciona de qualquer lugar com internet!

## 🌐 Como usar

1. Acesse `http://localhost:3000` no seu navegador
2. Digite seu nome de usuário para entrar no chat
3. Comece a conversar!

## 📡 Eventos do Socket.IO

### Eventos do Cliente para o Servidor:

- `join` - Usuário entra no chat
- `message` - Envia mensagem pública
- `private_message` - Envia mensagem privada
- `typing` - Indica que está digitando
- `video_call_request` - Solicita chamada de vídeo
- `video_call_response` - Responde à chamada (aceitar/recusar)
- `webrtc_offer` - Envia offer WebRTC
- `webrtc_answer` - Envia answer WebRTC
- `webrtc_ice_candidate` - Envia ICE candidate
- `video_call_end` - Encerra chamada de vídeo

### Eventos do Servidor para o Cliente:

- `user_joined` - Notifica quando usuário entra
- `user_left` - Notifica quando usuário sai
- `users_updated` - Atualiza lista de usuários online
- `message` - Recebe mensagem pública
- `private_message` - Recebe mensagem privada
- `user_typing` - Indica que alguém está digitando
- `video_call_request` - Recebe solicitação de chamada
- `video_call_response` - Recebe resposta da chamada
- `webrtc_offer` - Recebe offer WebRTC
- `webrtc_answer` - Recebe answer WebRTC
- `webrtc_ice_candidate` - Recebe ICE candidate
- `video_call_end` - Notifica fim da chamada
- `error` - Notifica erros

## 🏗️ Estrutura do Projeto

```
├── server.js          # Servidor Express com Socket.IO
├── package.json       # Dependências e scripts
├── public/
│   └── index.html     # Interface do chat
└── README.md          # Este arquivo
```

## 🔧 Configuração

O servidor roda na porta 3000 por padrão. Para alterar, defina a variável de ambiente `PORT`:

```bash
PORT=8080 npm start
```

## 📚 Tecnologias Utilizadas

- **Express.js** - Framework web para Node.js
- **Socket.IO** - Biblioteca para WebSockets em tempo real
- **WebRTC** - Tecnologia para comunicação peer-to-peer
- **HTML5/CSS3/JavaScript** - Interface do cliente
- **Node.js** - Runtime JavaScript

## 🎨 Interface

A interface inclui:
- Design moderno com gradientes
- Mensagens diferenciadas (próprias, de outros, sistema)
- Lista de usuários online com botões de chamada
- Interface de chamadas de vídeo em tela cheia
- Controles de vídeo (câmera/microfone)
- Indicador de digitação
- Notificações de chamada
- Responsividade para diferentes tamanhos de tela

## 🔒 Segurança

- Validação de entrada do usuário
- Escape de HTML para prevenir XSS
- CORS configurado para desenvolvimento
- Limitação de tamanho do nome de usuário

## 📝 Exemplo de Uso

```javascript
// Conectar ao servidor
const socket = io();

// Entrar no chat
socket.emit('join', 'MeuNome');

// Enviar mensagem
socket.emit('message', { message: 'Olá pessoal!' });

// Enviar mensagem privada
socket.emit('private_message', {
  targetUser: 'OutroUsuario',
  message: 'Mensagem privada'
});

// Solicitar chamada de vídeo
socket.emit('video_call_request', {
  targetUser: 'OutroUsuario',
  callId: 'unique-call-id'
});

// Responder à chamada
socket.emit('video_call_response', {
  accepted: true,
  targetSocketId: 'socket-id',
  callId: 'unique-call-id'
});
```

## 🎥 Como usar as Chamadas de Vídeo

### **Fazendo chamadas:**

1. **Iniciar uma chamada:**
   - Clique no botão "📹 Chamada" ao lado do nome do usuário
   - Permita o acesso à câmera e microfone quando solicitado

2. **Aceitar uma chamada:**
   - Clique em "Aceitar" na notificação que aparece
   - Permita o acesso à câmera e microfone

3. **Durante a chamada:**
   - Use os controles na parte inferior para:
     - 🎤 Ligar/desligar microfone
     - 📹 Ligar/desligar câmera
     - 📞 Encerrar chamada

4. **Recusar uma chamada:**
   - Clique em "Recusar" na notificação

### **Vantagens do Railway (HTTPS):**

- ✅ **Permissões automáticas:** HTTPS permite acesso mais fácil à câmera/microfone
- ✅ **Acesso global:** Funciona de qualquer lugar com internet
- ✅ **Sem configuração de rede:** Não precisa configurar firewall ou IP local
- ✅ **URL permanente:** Compartilhe uma URL fixa com seus amigos

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades!

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
