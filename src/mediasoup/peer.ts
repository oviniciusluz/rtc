import type * as mediasoup from 'mediasoup';

export class Peer {
  public readonly id: string;
  public name: string;

  public sendTransport?: mediasoup.types.WebRtcTransport;
  public recvTransport?: mediasoup.types.WebRtcTransport;

  public producers: Map<string, mediasoup.types.Producer> = new Map();
  public consumers: Map<string, mediasoup.types.Consumer> = new Map();

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name || `Peer-${id.slice(0, 8)}`;
    console.log(`Peer ${this.name} created`);
  }

  setTransport(sendTransport: mediasoup.types.WebRtcTransport, recvTransport: mediasoup.types.WebRtcTransport) {
    this.sendTransport = sendTransport;
    this.recvTransport = recvTransport;
  }

  async addProducer(producer: mediasoup.types.Producer) {
    this.producers.set(producer.id, producer);
  }

  async removeProducer(producer: mediasoup.types.Producer) {
    this.producers.delete(producer.id);
  }

  async addConsumer(consumer: mediasoup.types.Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  async removeConsumer(consumer: mediasoup.types.Consumer) {
    this.consumers.delete(consumer.id);
  }

  async closeAllProducers() {
    for (const producer of this.producers.values()) {
      producer.close();
    }
    this.producers.clear();
  }

  async closeAllConsumers() {
    for (const consumer of this.consumers.values()) {
      consumer.close();
    }
    this.consumers.clear();
  }

  async close() {
    await this.closeAllProducers();
    await this.closeAllConsumers();

    if (this.sendTransport) {
      this.sendTransport.close();
    }
    if (this.recvTransport) {
      this.recvTransport.close();
    }

    console.log(`Peer ${this.name} closed`);
  }

  getInfo () {
    return {
      id: this.id,
      name: this.name,
      producers: this.producers.size,
      consumers: this.consumers.size,
    }
  }
}