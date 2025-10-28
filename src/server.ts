import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Room, workerManager } from './mediasoup';

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
  }
  
  async inicialize() {
    await workerManager.createWorker();
  }
}

const server = new Server();
server.inicialize().catch((error) => {
  console.error('Error initializing server:', error);
  process.exit(1);
});