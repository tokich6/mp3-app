import express, { Request, Response } from 'express';
import fileUploadRoute from "./routes/upload";

const app = express();

app.use(express.json()); // Enable JSON parsing in the request body

//Routes
app.use('/file-upload', fileUploadRoute);

app.get('/', (req: Request, res: Response) => {
    res.send('MP3 file upload!');
});

// TODO: add Global error handler (should be after routes)

export default app;