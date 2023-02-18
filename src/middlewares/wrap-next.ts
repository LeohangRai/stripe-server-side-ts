import { NextFunction, Request, Response } from 'express';
import { CallbackFunction } from '../custom-types/callback-function-type';

export default function (fn: CallbackFunction) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* 
This is an async error handler middleware that we will use to wrap our route handlers inside of our routes definitions.
The reason why this is beneficial is because try/catch won't catch a Promise rejection outside of an async function and since express does not add a .catch handler to the Promise returned by our middleware, we might get an UnhandledPromiseRejectionWarning.
An easier solution would to add try/catch inside of our middlewares, and call next(err).
But if you have a lot of async middlewares, it may be a little repetitive.
Instead, we can let the errors bubble up, using a wrapper around async middlewares, that will call next(err) if the promise is rejected, reaching the express error handler and avoiding "UnhandledPromiseRejectionWarning".
*/
