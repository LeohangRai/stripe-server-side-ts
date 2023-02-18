import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/custom-error';

export default function (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message
  });
}
