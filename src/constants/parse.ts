import { MP3LookupTable } from '../interfaces';

// MPEG-1 Layer 3 bitrate table (kbps)
export const BITRATE_TABLE: MP3LookupTable = {
  1: 32,
  2: 40,
  3: 48,
  4: 56,
  5: 64,
  6: 80,
  7: 96,
  8: 112,
  9: 128,
  10: 160,
  11: 192,
  12: 224,
  13: 256,
  14: 320,
};

// MPEG-1 sample rate table (Hz)
export const SAMPLE_RATE_TABLE: MP3LookupTable = {
  0: 44100,
  1: 48000,
  2: 32000,
};
