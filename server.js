const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Criar aplicação Express
const app = express();
const server = createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Armazenar usuários conectados
const connectedUsers = new Map();

// Eventos do Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Evento para quando um usuário se junta ao chat
  socket.on('join', (username) => {
    connectedUsers.set(socket.id, username);
    socket.username = username;
    
    // Notificar todos os usuários sobre a nova conexão
    socket.broadcast.emit('user_joined', {
      username: username,
      message: `${username} entrou no chat`,
      timestamp: new Date().toISOString()
    });

    // Enviar lista de usuários online para o usuário que acabou de conectar
    socket.emit('users_online', Array.from(connectedUsers.values()));

    // Notificar todos sobre a lista atualizada de usuários
    io.emit('users_updated', Array.from(connectedUsers.values()));

    console.log(`${username} (${socket.id}) entrou no chat`);
  });

  // Evento para receber mensagens
  socket.on('message', (data) => {
    const messageData = {
      id: socket.id,
      username: socket.username || 'Usuário Anônimo',
      message: data.message,
      timestamp: new Date().toISOString()
    };

    // Enviar mensagem para todos os usuários conectados
    io.emit('message', messageData);
    console.log(`Mensagem de ${messageData.username}: ${messageData.message}`);
  });

  // Evento para mensagens privadas
  socket.on('private_message', (data) => {
    const targetUser = data.targetUser;
    const messageData = {
      from: socket.username || 'Usuário Anônimo',
      to: targetUser,
      message: data.message,
      timestamp: new Date().toISOString(),
      isPrivate: true
    };

    // Encontrar o socket do usuário destinatário
    const targetSocket = Array.from(io.sockets.sockets.values())
      .find(s => s.username === targetUser);

    if (targetSocket) {
      // Enviar mensagem privada para o destinatário
      targetSocket.emit('private_message', messageData);
      // Enviar confirmação para o remetente
      socket.emit('private_message_sent', messageData);
      console.log(`Mensagem privada de ${messageData.from} para ${messageData.to}: ${messageData.message}`);
    } else {
      // Usuário não encontrado
      socket.emit('error', {
        message: `Usuário ${targetUser} não encontrado ou offline`
      });
    }
  });

  // Evento para digitação
  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', {
      username: socket.username || 'Usuário Anônimo',
      isTyping: data.isTyping
    });
  });

  // Eventos WebRTC para chamadas de vídeo
  socket.on('video_call_request', (data) => {
    const targetSocket = Array.from(io.sockets.sockets.values())
      .find(s => s.username === data.targetUser);

    if (targetSocket) {
      targetSocket.emit('video_call_request', {
        from: socket.username || 'Usuário Anônimo',
        fromSocketId: socket.id,
        callId: data.callId
      });
      console.log(`Chamada de vídeo solicitada: ${socket.username} → ${data.targetUser}`);
    } else {
      socket.emit('error', {
        message: `Usuário ${data.targetUser} não encontrado ou offline`
      });
    }
  });

  socket.on('video_call_response', (data) => {
    const targetSocket = io.sockets.sockets.get(data.targetSocketId);
    
    if (targetSocket) {
      targetSocket.emit('video_call_response', {
        accepted: data.accepted,
        from: socket.username || 'Usuário Anônimo',
        fromSocketId: socket.id,
        callId: data.callId
      });
      console.log(`Resposta da chamada: ${socket.username} ${data.accepted ? 'aceitou' : 'rejeitou'} a chamada`);
    }
  });

  socket.on('webrtc_offer', (data) => {
    const targetSocket = io.sockets.sockets.get(data.targetSocketId);
    
    if (targetSocket) {
      console.log(`📤 Enviando offer de ${socket.username} para ${targetSocket.username}`);
      targetSocket.emit('webrtc_offer', {
        offer: data.offer,
        from: socket.username || 'Usuário Anônimo',
        fromSocketId: socket.id,
        callId: data.callId
      });
    } else {
      console.log(`❌ Socket ${data.targetSocketId} não encontrado para offer`);
    }
  });

  socket.on('webrtc_answer', (data) => {
    const targetSocket = io.sockets.sockets.get(data.targetSocketId);
    
    if (targetSocket) {
      console.log(`📤 Enviando answer de ${socket.username} para ${targetSocket.username}`);
      targetSocket.emit('webrtc_answer', {
        answer: data.answer,
        from: socket.username || 'Usuário Anônimo',
        callId: data.callId
      });
    } else {
      console.log(`❌ Socket ${data.targetSocketId} não encontrado para answer`);
    }
  });

  socket.on('webrtc_ice_candidate', (data) => {
    const targetSocket = io.sockets.sockets.get(data.targetSocketId);
    
    if (targetSocket) {
      console.log(`🧊 Enviando ICE candidate de ${socket.username} para ${targetSocket.username}`);
      targetSocket.emit('webrtc_ice_candidate', {
        candidate: data.candidate,
        from: socket.username || 'Usuário Anônimo',
        callId: data.callId
      });
    } else {
      console.log(`❌ Socket ${data.targetSocketId} não encontrado para ICE candidate`);
    }
  });

  socket.on('video_call_end', (data) => {
    const targetSocket = io.sockets.sockets.get(data.targetSocketId);
    
    if (targetSocket) {
      targetSocket.emit('video_call_end', {
        from: socket.username || 'Usuário Anônimo',
        callId: data.callId
      });
    }
  });

  // Evento para quando um usuário se desconecta
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    
    if (username) {
      connectedUsers.delete(socket.id);
      
      // Notificar todos os usuários sobre a desconexão
      socket.broadcast.emit('user_left', {
        username: username,
        message: `${username} saiu do chat`,
        timestamp: new Date().toISOString()
      });

      // Atualizar lista de usuários online
      io.emit('users_updated', Array.from(connectedUsers.values()));
      
      console.log(`${username} (${socket.id}) saiu do chat`);
    } else {
      console.log(`Usuário ${socket.id} desconectado`);
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Aceita conexões de qualquer IP

server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse localmente: http://localhost:${PORT}`);
  console.log(`Acesse pela rede: http://[SEU_IP_LOCAL]:${PORT}`);
  console.log(`\nPara descobrir seu IP local, execute: ipconfig (Windows) ou ifconfig (Linux/Mac)`);
});
