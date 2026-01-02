//#region global imports
import express from 'express';
//#endregion global imports

//#region local imports
import fileUploadRoute from './routes/upload';
import { errorHandler } from './middleware';
//#endregion local imports

const app = express();

app.use(express.json()); // Enable JSON parsing in the request body

//Routes
app.use('/file-upload', fileUploadRoute);

// Global error handler
app.use(errorHandler);

export default app;
