export interface FileUploadInDto {
  filename: string;
  mimetype: string;
  size?: number;
  path: string;
}

export interface FileUploadOutDto {
  frameCount: number;
}

export type MP3FrameHeader = {
  mpegVersion: number;
  layer: number;
  bitrate: number;
  sampleRate: number;
  padding: number;
  frameLength: number;
};

export type MP3LookupTable = {
  [key: number]: number;
};

export interface ErrorResponse extends Error {
  status?: number;
}