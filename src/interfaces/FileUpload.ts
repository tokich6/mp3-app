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
