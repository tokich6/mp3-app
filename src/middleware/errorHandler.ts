//#region global imports
import { NextFunction, Request, Response } from 'express';
//#endregion global imports

//#region local imports
import { ErrorResponse } from '../interfaces';
//#endregion local imports

/**
 * Global error handling middleware
 * Must be registered last in the middleware chain
 */
export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error for you to see in the terminal
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  res.status(status).json({
    message,
    status,
  });
};
