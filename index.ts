import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import { UserEntity } from './entity/user.entity';
import { myDataSource } from './app-data-source';

// establish database connection
myDataSource.initialize()
.then(() => {
    console.log("Database connection established successfully!");
})
.catch((err) => {
    console.log("Database connection failed!", err);
})

// express setup
const app: Express = express();
const port = process.env.PORT;

// stripe setup
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || '';
const endPointSecretKey: string = process.env.ENDPOINT_SECRET_KEY || '';
const clientUrl: string = process.env.CLIENT_URL || '';
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
    typescript: true
});

// register routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Stripe demo!');
})

app.get('/users', async function(req: Request, res: Response) {
    const users = await myDataSource.getRepository(UserEntity).find();
    res.json(users);
})

app.post('/users', async function (req: Request, res: Response) {
    const user = myDataSource.getRepository(UserEntity).create(req.body);
    const result = await myDataSource.getRepository(UserEntity).save(user)
    return res.json(result);
})

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

app.post('/stripe-webhook', express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] || '';    
    let event;
    try {
        /* verify stripe signature */
        event = stripe.webhooks.constructEvent(req.body, signature, endPointSecretKey);
        console.log("event:", event);        
    } catch (err) {
        console.log("err:", err);
        return res.status(400).send(`Webhook error: ${err.message}`)
    }
    if(event.type == 'checkout.session.completed') {
        const session = event.data.object;
        console.log("session:", session);
    }
    return res.status(200).send();
})

app.listen(port, () => {
    console.log(`Server is up and running at port: ${port}`);
})