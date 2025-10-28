import mediasoup from 'mediasoup';
import { workerSettings } from '../config';

export class WorkerManager {
  private workers: mediasoup.types.Worker[] = [];
  private workersNum = 1;
  private currentWorkerIndex = 0;

  async createWorker() {
    for (let i = 0; i < this.workersNum; i++) {
      try {
        const worker = await mediasoup.createWorker({
          ...workerSettings,
        });
  
        worker.on('died', () => {
          console.error('Worker died, restarting...');
          process.exit(1);
        });
  
        this.workers.push(worker);
  
      } catch (error) {
        console.error('Error creating worker, retrying...');
        throw error;
      }
    }
    
    console.log('Workers created successfully');
  }

  getNextWorker() {
    if (this.workers.length === 0) {
      throw new Error('No workers available');
    }

    const worker = this.workers[this.currentWorkerIndex];
    this.currentWorkerIndex = (this.currentWorkerIndex + 1) % this.workers.length;
    
    return worker;
  }

  getWorker(index: number) {
    if (index < 0 || index >= this.workers.length) {
      throw new Error('Invalid worker index');
    }

    return this.workers[index];
  }

  getWorkers() {
    return this.workers;
  }

  getWorkersInfo() {
    return this.workers.map((worker, index) => {
      return {
        index,
        pid: worker.pid,
        uptime: process.uptime(),
      };
    });
  }

  async close() {
    console.log('Closing workers...');

    await Promise.all(
      this.workers.map(async (worker) => {
        try {
          worker.close();
          console.log(`Worker ${worker.pid} closed`);
        } catch (error) {
          console.error(`Error closing worker ${worker.pid}:`, error);
        }
      })
    );

    this.workers = [];
    console.log('All workers closed');
  }
}

export const workerManager = new WorkerManager();