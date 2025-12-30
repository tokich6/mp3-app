//#region global imports
import fs from 'fs';
import { Router, Request, Response, NextFunction } from 'express';
//#endregion global imports

//#region local imports
import { parseFile } from '../services/workerPool';
import { handleFileUpload } from '../middleware';
//#endregion local imports

const router = Router();

router.post(
  '/',
  // TODO: Add rate limiting middleware here to prevent abuse
  handleFileUpload,
  async (req: Request, res: Response, next: NextFunction) => {
    let filePath: string | undefined;
    try {
      if (!req.file || !req.file.path) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      filePath = req.file.path;

      const frameCount = await parseFile(filePath);

      res.status(201).json({ frameCount });
    } catch (error) {
      next(error); // Passes error to error handler
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
        } catch (unlinkError) {
          console.error('Failed to cleanup file:', unlinkError);
        }
      }
    }
  }
);

export default router;
