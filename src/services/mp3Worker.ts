import { parentPort } from 'worker_threads';
import fs from 'fs';

import { countMP3Frames } from './mp3Parser';
import { WorkerMessage, WorkerResponse } from '../interfaces';

if (!parentPort) {
  throw new Error('This script must be run as a Worker thread');
}

parentPort.on('message', async ({ filePath, jobId }: WorkerMessage) => {
  try {
    const buffer = await fs.promises.readFile(filePath);
    const frameCount = countMP3Frames(buffer);

    // Clean up file
    await fs.promises.unlink(filePath);

    const response: WorkerResponse = { jobId, success: true, frameCount };
    parentPort!.postMessage(response);
  } catch (error) {
    // Clean up on error too
    try {
      await fs.promises.unlink(filePath);
    } catch (cleanupError) {
      console.error('Failed to cleanup temp file:', cleanupError);
    }

    const response: WorkerResponse = {
      jobId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    parentPort!.postMessage(response);
  }
});
