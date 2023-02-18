export default class CustomError extends Error {
    status: string;
    isOperational: boolean;
    constructor(public statusCode: number = 500, public message: string) {
        super(message);
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}