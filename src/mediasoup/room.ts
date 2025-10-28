import * as mediasoup from 'mediasoup';
import { Peer } from './peer';
import { workerManager } from './worker';
import { routerSettings } from '../config';

export class Room {
  public readonly id: string;
  private router: mediasoup.types.Router;
  private worker: mediasoup.types.Worker;
  private peers: Map<string, Peer> = new Map();
  private producers: Map<string, mediasoup.types.Producer> = new Map();

  constructor(id: string, router: mediasoup.types.Router, worker: mediasoup.types.Worker) {
    this.id = id;
    this.router = router;
    this.worker = worker;
    console.log(`Room ${this.id} created`);
  }

  async addPeer(peer: Peer) {
    this.peers.set(peer.id, peer);
  }

  async removePeer(peerId: string) {
    const peer = this.peers.get(peerId);

    if (peer) {
      this.peers.delete(peerId);
    }
  }

  getRouter() {
    return this.router;
  }

  getWorker() {
    return this.worker;
  }

  async addProducer(producer: mediasoup.types.Producer, peerId: string) {
    this.producers.set(producer.id, producer);
    this.notifyNewProducer(producer, peerId);
  }

  private notifyNewProducer(producer: mediasoup.types.Producer, peerId: string) {
    for (const [otherPeerId, otherPeer] of this.peers.entries()) {
      if (otherPeerId !== peerId) {
        console.log(`Notifying ${otherPeer.name} about new producer ${producer.id}`);
      };
    }
  }
  
  getPeers() {
    return this.peers;
  }

  getPeer(peerId: string) {
    return this.peers.get(peerId);
  }

  getProducers() {
    return this.producers;
  }

  isEmpty() {
    return this.peers.size === 0;
  }

  async close() {
    this.peers.clear();
    this.producers.clear();
    this.router.close();

    console.log(`Room ${this.id} closed`);
  }
}

export class RoomFactory {
  static async createRoom(roomId: string) {
    const worker = workerManager.getNextWorker();

    const router = await worker.createRouter(routerSettings);

    return new Room(roomId, router, worker);
  }
}