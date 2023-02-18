import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import { myDataSource } from './app-data-source';
import CustomError from './utils/custom-error';
import globalErrorHandler from './middlewares/global-error-handler';
import userRouter from './routes/users.routes';
import productRouter from './routes/products.routes';

// establish database connection
myDataSource.initialize()
.then(async () => {
    console.log("Database connection established successfully!");
    // express setup
    const app: Express = express();
    const port = process.env.PORT || 3000;

    // stripe setup
    const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || '';
    const endPointSecretKey: string = process.env.ENDPOINT_SECRET_KEY || '';
    const clientUrl: string = process.env.CLIENT_URL || '';
    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2022-11-15',
        typescript: true
    });

    app.post('/stripe-webhook', express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
        const signature = req.headers['stripe-signature'] || '';    
        let event;
        try {
            /* verify stripe signature */
            event = stripe.webhooks.constructEvent(req.body, signature, endPointSecretKey);
        } catch (err) {
            return res.status(400).send(`Webhook error: ${err.message}`)
        }
        if(event.type == 'checkout.session.completed') {
            const session = event.data.object;
            console.log("session:", session);
        }
        switch(event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                // save the order as "complete but awaiting payment"
                
            }
        }
        return res.status(200).send();
    })


    app.use(express.json());

    // register routes
    app.get('/', (req: Request, res: Response) => {
        res.send('Welcome to Stripe demo!');
    })

    app.use('/users', userRouter);
    app.use('/products', productRouter);

    app.post('/initiate-payment', async (req: Request, res: Response) => {
        try {
            const { url } = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Registration'
                            },
                            unit_amount: 10
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    transactionId: 'certain-uuid'
                },
                success_url: `${clientUrl}/success`,
                cancel_url: `${clientUrl}/cancel`
            })
            return res.json({
                redirectUrl: url
            })
        } catch (err) {
            console.log("error:", err);        
            return res.status(500).json({
                error: "Oops! Something went wrong!"
            })
        }
    })

    // Unhandled routes
    app.all('*', (req: Request, res:Response, next: NextFunction) => {
        next(new CustomError(404, `Route ${req.method.toUpperCase()} ${req.originalUrl} not found!`));
    })

    // Global error handler
    app.use(globalErrorHandler);

    app.listen(port, () => {
        console.log(`Server is up and running at port: ${port}`);
    })
})
.catch((err) => {
    console.log("Database connection failed!", err);
})

