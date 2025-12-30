import express from 'express';
import fileUploadRoute from './routes/upload';
import { errorHandler } from './middleware';

const app = express();

app.use(express.json()); // Enable JSON parsing in the request body

//Routes
app.use('/file-upload', fileUploadRoute);

// Global error handler
app.use(errorHandler);

export default app;
