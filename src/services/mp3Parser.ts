import { MP3FrameHeader } from '../interfaces';
import { BITRATE_TABLE, SAMPLE_RATE_TABLE } from '../constants';

/**
 * Parses an MP3 frame header and extracts frame information.
 *
 * @param buffer - The buffer containing MP3 data
 * @param offset - The offset in the buffer where the frame header starts
 * @returns Parsed frame header information, or null if invalid
 */
function parseFrameHeader(
  buffer: Buffer,
  offset: number
): MP3FrameHeader | null {
  if (offset + 4 > buffer.length) {
    return null;
  }

  // Read 4-byte header
  const header =
    (buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3];

  // Extract header fields
  const mpegVersion = (header >> 19) & 0x03; // 2 bits
  const layer = (header >> 17) & 0x03; // 2 bits
  const bitrateIndex = (header >> 12) & 0x0f; // 4 bits
  const sampleRateIndex = (header >> 10) & 0x03; // 2 bits
  const padding = (header >> 9) & 0x01; // 1 bit

  // Validate MPEG-1 Layer 3
  // MPEG-1 = 11 (binary) = 3 (decimal)
  // Layer 3 = 01 (binary) = 1 (decimal)
  if (mpegVersion !== 3 || layer !== 1) {
    return null;
  }

  // Validate bitrate index (0 = free format, 15 = invalid)
  if (bitrateIndex === 0 || bitrateIndex === 15) {
    return null;
  }

  // Validate sample rate index (3 = reserved)
  if (sampleRateIndex === 3) {
    return null;
  }

  // Get bitrate and sample rate from tables
  const bitrate = BITRATE_TABLE[bitrateIndex];
  const sampleRate = SAMPLE_RATE_TABLE[sampleRateIndex];

  // Validate bitrate and sample rate
  if (!bitrate || !sampleRate) {
    return null;
  }

  // Formula: FrameLength = (144 * BitRate / SampleRate) + Padding
  const frameLength = Math.floor((144 * bitrate * 1000) / sampleRate + padding);

  return {
    mpegVersion,
    layer,
    bitrate,
    sampleRate,
    padding,
    frameLength,
  };
}

/**
 * Skips ID3v2 tag if present at the beginning of the file.
 *
 * @param buffer - The buffer containing MP3 data
 * @returns Offset to start parsing frames (after ID3v2 tag)
 */
function skipID3v2Tag(buffer: Buffer): number {
  // ID3v2 starts with "ID3" (0x49 0x44 0x33)
  if (
    buffer.length >= 10 &&
    buffer[0] === 0x49 &&
    buffer[1] === 0x44 &&
    buffer[2] === 0x33
  ) {
    // Parse tag size (synchsafe integer - 7 bits per byte)
    const tagSize =
      ((buffer[6] & 0x7f) << 21) |
      ((buffer[7] & 0x7f) << 14) |
      ((buffer[8] & 0x7f) << 7) |
      (buffer[9] & 0x7f);

    // Return offset after ID3v2 tag (10 bytes header + tag size)
    return tagSize + 10;
  }

  return 0;
}

/**
 * Counts the number of valid MP3 frames in a buffer.
 *
 * @param buffer - Buffer containing MP3 file data
 * @returns Promise resolving to the number of complete frames
 * @throws {Error} If buffer is empty or contains no valid MP3 frames
 */
export function countMP3Frames(buffer: Buffer): number {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty buffer provided');
  }

  let frameCount = 0;
  let offset = skipID3v2Tag(buffer);

  // Check for ID3v1 tag at end (128 bytes starting with "TAG")
  let endOffset = buffer.length;
  if (
    buffer.length >= 128 &&
    buffer[buffer.length - 128] === 0x54 && // 'T'
    buffer[buffer.length - 127] === 0x41 && // 'A'
    buffer[buffer.length - 126] === 0x47 // 'G'
  ) {
    endOffset = buffer.length - 128;
  }

  // Parse frames until end of file
  while (offset < endOffset - 4) {
    // Look for frame sync word (11 bits set to 1)
    // First byte must be 0xFF
    // Second byte must have top 3 bits set (0xE0)
    if (buffer[offset] !== 0xff || (buffer[offset + 1] & 0xe0) !== 0xe0) {
      offset++;
      continue;
    }

    // Try to parse frame header
    const frameHeader = parseFrameHeader(buffer, offset);

    // If invalid header, skip byte
    if (!frameHeader || frameHeader.frameLength <= 0) {
      offset++;
      continue;
    }

    const nextOffset = offset + frameHeader.frameLength;

    // Don't count frames that would extend to or past EOF (only count frames with verifiable boundaries)
    if (nextOffset >= endOffset) {
      break;
    }

    // Valid complete frame found
    frameCount++;
    offset = nextOffset;
  }

  if (frameCount === 0) {
    throw new Error('No valid MP3 frames found in file');
  }

  return frameCount;
}
