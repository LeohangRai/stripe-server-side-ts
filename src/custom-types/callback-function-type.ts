import { NextFunction, Request, Response } from 'express';

/* eslint-disable */
export type CallbackFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;
/* eslint-enable */
