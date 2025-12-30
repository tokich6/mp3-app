import { Router, Request, Response } from 'express';
import { FileUploadInDto, FileUploadOutDto } from '../interfaces';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    const fileUpload: FileUploadInDto = {
        filename: 'tes', path: '', mimetype: 'text/plain',
    };

    const response: FileUploadOutDto = {
        frameCount: 0,
    };
    res.status(201).json(response);
});

export default router;