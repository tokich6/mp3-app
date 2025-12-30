import { Worker } from 'worker_threads';
import path from 'path';

import { JobQueue } from '../interfaces';

const jobQueue: JobQueue = [];

let processing = false;

function createWorker(): Promise<Worker> {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, 'mp3Worker.js');
    const worker = new Worker(workerPath);

    worker.on('error', reject);
    worker.once('online', () => resolve(worker));
  });
}

async function processQueue(): Promise<void> {
  if (processing || jobQueue.length === 0) return;

  processing = true;

  while (jobQueue.length > 0) {
    const job = jobQueue.shift()!;

    try {
      const worker = await createWorker();

      const result = await new Promise<number>((resolve, reject) => {
        worker.once('message', ({ success, frameCount, error }) => {
          worker.terminate();
          if (success) {
            resolve(frameCount);
          } else {
            reject(new Error(error));
          }
        });

        worker.postMessage({
          filePath: job.filePath,
          jobId: Date.now().toString(),
        });
      });
      job.resolve(result);
    } catch (error) {
      job.reject(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  processing = false;
}

export function parseFile(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    jobQueue.push({ filePath, resolve, reject });
    processQueue();
  });
}
