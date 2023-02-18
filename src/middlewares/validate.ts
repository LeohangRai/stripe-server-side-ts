import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            params: req.params,
            query: req.query,
            body: req.body
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(422).json({
                status: 'fail',
                errors: error.errors
            });
        }
        next(error);
    }
}