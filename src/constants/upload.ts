export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 200 * 1024 * 1024, // 200MB
  TEMP_DIR: './temp-uploads',
  ALLOWED_MIME_TYPES: ['audio/mpeg'],
  ALLOWED_EXTENSIONS: ['.mp3'],
} as const;
