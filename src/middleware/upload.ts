import path from 'path';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';

import { UPLOAD_CONSTANTS } from '../constants';

const storage = multer.diskStorage({
  destination: `${UPLOAD_CONSTANTS.TEMP_DIR}`,
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configure multer for file upload
const upload = multer({
  storage,
  limits: {
    fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, callBack) => {
    // Accept only audio/mpeg MIME type
    if (
      file.mimetype === UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES[0] ||
      path.extname(file.originalname).toLowerCase() ===
        UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS[0]
    ) {
      callBack(null, true);
    } else {
      callBack(new Error('Invalid file type. Please upload an MP3 file'));
    }
  },
});

export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single('file')(req, res, (err: unknown) => {
    if (err) {
      // Type guard for multer errors (MulterError has a 'code' property)
      if (err && typeof err === 'object' && 'code' in err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: `File too large. Maximum size is ${UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
          });
        }
        // Handle other multer errors
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            error: 'Unexpected file field',
          });
        }
      }
      // If it's a multer error but not handled above, or other error
      return next(err as Error);
    }
    next();
  });
};
