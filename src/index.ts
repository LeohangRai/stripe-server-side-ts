import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { myDataSource } from './app-data-source';
import CustomError from './utils/custom-error';
import globalErrorHandler from './middlewares/global-error-handler';
import userRouter from './routes/users.routes';
import productRouter from './routes/products.routes';
import paymentRouter from './routes/payments.routes';
import webhookRouter from './routes/stripe-webhook.route';

myDataSource
  .initialize()
  .then(async () => {
    console.log('Database connection established successfully!');
    const app: Express = express();
    const port = process.env.PORT || 3000;

    /* had to register the stripe webhook route before express.json() or the bodyParser because stripe-webhook requires raw body for validating signatures */
    app.use('/webhooks', webhookRouter);

    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to Stripe demo!');
    });

    app.use('/users', userRouter);
    app.use('/products', productRouter);
    app.use('/payments', paymentRouter);

    // Unhandled routes
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(
        new CustomError(
          404,
          `Route ${req.method.toUpperCase()} ${req.originalUrl} not found!`
        )
      );
    });

    // Global error handler
    app.use(globalErrorHandler);

    app.listen(port, () => {
      console.log(`Server is up and running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.log('Database connection failed!', err);
  });
