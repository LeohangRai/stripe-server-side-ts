import { NextFunction, Request, Response } from "express";

/* 
    This is an async error handler middleware that we will use to wrap our route handlers.
    The problem is that try/catch won't catch a Promise rejection outside of an async function and since express does not add a .catch handler to the Promise returned by your middleware, you get an UnhandledPromiseRejectionWarning.
    The easy way, is to add try/catch inside your middleware, and call next(err).
    But if you have a lot of async middlewares, it may be a little repetitive.
    Instead, we can let the errors bubble up, using a wrapper around async middlewares, that will call next(err) if the promise is rejected, reaching the express error handler and avoiding "UnhandledPromiseRejectionWarning"
*/
export default function(fn: Function) {
    return function(req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}