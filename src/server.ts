import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import { Room, RoomFactory, workerManager } from './mediasoup';
import { createTransportConfig } from './config';

import { ClientData } from './types';

class Server {
  private app: express.Application;
  private httpServer: ReturnType<typeof createServer>;
  private io: SocketIOServer;
  private rooms: Map<string, Room> = new Map();
  private clients: Map<string, ClientData> = new Map();

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.setupMiddleware();
    this.setupSocketHandlers();
    this.setupErrorHandling();
  }
  
  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        workers: workerManager.getWorkersInfo(),
        rooms: this.rooms.size,
        clients: this.clients.size
      });
    });
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);
      
      // Join room handler
      socket.on('join-room', async (data: { roomId: string; name?: string }) => {
        try {
          const { roomId, name } = data;
          const room = await this.getOrCreateRoom(roomId);
          const peer = new (await import('./mediasoup')).Peer(socket.id, name || 'Anonymous');
          
          await room.addPeer(peer);
          
          const clientData: ClientData = {
            socket,
            currentRoom: room,
            currentPeer: peer
          };
          
          this.clients.set(socket.id, clientData);
          
          socket.join(roomId);
          socket.emit('room-joined', { 
            roomId, 
            peerId: peer.id,
            peers: Array.from(room.getPeers().values()).map(p => p.getInfo())
          });
          
          // Notify other peers
          socket.to(roomId).emit('peer-joined', peer.getInfo());
          
          console.log(`Peer ${peer.name} joined room ${roomId}`);
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Create transport handler
      socket.on('create-transport', async (data: { direction: 'send' | 'recv' }) => {
        try {
          const client = this.clients.get(socket.id);
          if (!client?.currentRoom || !client?.currentPeer) {
            socket.emit('error', { message: 'Not in a room' });
            return;
          }

          const transport = await this.createWebRtcTransport(client.currentRoom, data.direction);
          
          if (data.direction === 'send') {
            client.currentPeer.sendTransport = transport;
          } else {
            client.currentPeer.recvTransport = transport;
          }

          socket.emit('transport-created', {
            direction: data.direction,
            transportId: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
          });
        } catch (error) {
          console.error('Error creating transport:', error);
          socket.emit('error', { message: 'Failed to create transport' });
        }
      });

      // Connect transport handler
      socket.on('connect-transport', async (data: { 
        transportId: string; 
        dtlsParameters: any 
      }) => {
        try {
          const client = this.clients.get(socket.id);
          if (!client?.currentPeer) {
            socket.emit('error', { message: 'Peer not found' });
            return;
          }

          const transport = client.currentPeer.sendTransport?.id === data.transportId 
            ? client.currentPeer.sendTransport 
            : client.currentPeer.recvTransport;

          if (!transport) {
            socket.emit('error', { message: 'Transport not found' });
            return;
          }

          await transport.connect({ dtlsParameters: data.dtlsParameters });
          socket.emit('transport-connected', { transportId: data.transportId });
        } catch (error) {
          console.error('Error connecting transport:', error);
          socket.emit('error', { message: 'Failed to connect transport' });
        }
      });

      // Produce handler (send audio/video)
      socket.on('produce', async (data: {
        transportId: string;
        kind: 'audio' | 'video';
        rtpParameters: any;
      }) => {
        try {
          const client = this.clients.get(socket.id);
          if (!client?.currentRoom || !client?.currentPeer) {
            socket.emit('error', { message: 'Not in a room' });
            return;
          }

          const transport = client.currentPeer.sendTransport;
          if (!transport || transport.id !== data.transportId) {
            socket.emit('error', { message: 'Invalid transport' });
            return;
          }

          const producer = await transport.produce({
            kind: data.kind,
            rtpParameters: data.rtpParameters
          });

          await client.currentPeer.addProducer(producer);
          await client.currentRoom.addProducer(producer, client.currentPeer.id);

          socket.emit('produced', { 
            producerId: producer.id,
            kind: data.kind 
          });

          // Notify other peers about new producer
          socket.to(client.currentRoom.id).emit('new-producer', {
            producerId: producer.id,
            peerId: client.currentPeer.id,
            kind: data.kind
          });

          console.log(`Producer ${producer.id} created for peer ${client.currentPeer.name}`);
        } catch (error) {
          console.error('Error producing:', error);
          socket.emit('error', { message: 'Failed to produce' });
        }
      });

      // Consume handler (receive audio/video)
      socket.on('consume', async (data: { 
        producerId: string; 
        transportId: string; 
        rtpCapabilities: any 
      }) => {
        try {
          const client = this.clients.get(socket.id);
          if (!client?.currentRoom || !client?.currentPeer) {
            socket.emit('error', { message: 'Not in a room' });
            return;
          }

          const transport = client.currentPeer.recvTransport;
          if (!transport || transport.id !== data.transportId) {
            socket.emit('error', { message: 'Invalid transport' });
            return;
          }

          const router = client.currentRoom.getRouter();
          if (!router.canConsume({ producerId: data.producerId, rtpCapabilities: data.rtpCapabilities })) {
            socket.emit('error', { message: 'Cannot consume this producer' });
            return;
          }

          const consumer = await transport.consume({
            producerId: data.producerId,
            rtpCapabilities: data.rtpCapabilities,
            paused: true
          });

          await client.currentPeer.addConsumer(consumer);

          socket.emit('consumed', {
            consumerId: consumer.id,
            producerId: data.producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters
          });
        } catch (error) {
          console.error('Error consuming:', error);
          socket.emit('error', { message: 'Failed to consume' });
        }
      });

      // Resume consumer handler
      socket.on('resume-consumer', async (data: { consumerId: string }) => {
        try {
          const client = this.clients.get(socket.id);
          if (!client?.currentPeer) {
            socket.emit('error', { message: 'Peer not found' });
            return;
          }

          const consumer = client.currentPeer.consumers.get(data.consumerId);
          if (!consumer) {
            socket.emit('error', { message: 'Consumer not found' });
            return;
          }

          await consumer.resume();
          socket.emit('consumer-resumed', { consumerId: data.consumerId });
        } catch (error) {
          console.error('Error resuming consumer:', error);
          socket.emit('error', { message: 'Failed to resume consumer' });
        }
      });

      // Get router RTP capabilities
      socket.on('get-router-rtp-capabilities', async () => {
        try {
          const client = this.clients.get(socket.id);
          if (!client?.currentRoom) {
            socket.emit('error', { message: 'Not in a room' });
            return;
          }

          const router = client.currentRoom.getRouter();
          socket.emit('router-rtp-capabilities', router.rtpCapabilities);
        } catch (error) {
          console.error('Error getting router capabilities:', error);
          socket.emit('error', { message: 'Failed to get router capabilities' });
        }
      });

      // Disconnect handler
      socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);
        await this.removeClient(socket.id);
      });
    });
  }

  private setupErrorHandling() {
    this.io.on('connection_error', (error) => {
      console.error('Connection error:', error);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await workerManager.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down server...');
      await workerManager.close();
      process.exit(0);
    });
  }

  private async getOrCreateRoom(roomId: string): Promise<Room> {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = await RoomFactory.createRoom(roomId);
      this.rooms.set(roomId, room);
    }
    return room;
  }

  private async removeRoomIfEmpty(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room && room.isEmpty()) {
      await room.close();
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} removed (empty)`);
    }
  }

  private async removeClient(socketId: string) {
    const client = this.clients.get(socketId);
    if (client) {
      if (client.currentRoom && client.currentPeer) {
        const roomId = client.currentRoom.id;
        await client.currentRoom.removePeer(client.currentPeer.id);
        await client.currentPeer.close();
        
        // Notify other peers
        client.socket.to(roomId).emit('peer-left', client.currentPeer.getInfo());
        
        await this.removeRoomIfEmpty(roomId);
      }
      this.clients.delete(socketId);
    }
  }

  private async createWebRtcTransport(room: Room, direction: 'send' | 'recv') {
    const router = room.getRouter();
    const worker = room.getWorker();
    const transport = await router.createWebRtcTransport(createTransportConfig(worker));
    
    return transport;
  }
  
  async inicialize() {
    await workerManager.createWorker();
    
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    this.httpServer.listen(port, host, () => {
      console.log(`Server running on ${host}:${port}`);
      console.log(`Workers created: ${workerManager.getWorkers().length}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

const server = new Server();
server.inicialize().catch((error) => {
  console.error('Error initializing server:', error);
  process.exit(1);
});