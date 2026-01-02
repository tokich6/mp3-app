export type WorkerMessage = {
  filePath: string;
  jobId: string;
};

export type WorkerResponse = {
  jobId: string;
  success: boolean;
  frameCount?: number;
  error?: string;
};

export type JobQueue = {
  filePath: string;
  resolve: (count: number) => void;
  reject: (error: Error) => void;
}[];
