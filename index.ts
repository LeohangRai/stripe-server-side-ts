import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import { UserEntity } from './entity/user.entity';
import { myDataSource } from './app-data-source';
import { ProductEntity } from './entity/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { validate, ValidationError } from 'class-validator';
import { CreateUserDto } from './dtos/create-user.dto';

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

app.get('/users', async function(req: Request, res: Response) {
    const users = await myDataSource.getRepository(UserEntity).find();
    res.json(users);
})

app.post('/users', async function (req: Request, res: Response) {
    const userData = new CreateUserDto();
    userData.firstName = req.body.firstName;
    userData.lastName = req.body.lastName;
    userData.age = req.body.age;
    const errors = await validate(userData);
    if(errors.length > 0) {
        const errorPayload = resolveValidationErrors(errors);
        return res.status(400).send(errorPayload);
    }
    const user = myDataSource.getRepository(UserEntity).create(req.body);
    const result = await myDataSource.getRepository(UserEntity).save(user)
    return res.status(201).json(result);
})

app.get('/products', async (req: Request, res: Response) => {
    const products = await myDataSource.getRepository(ProductEntity).find();
    res.json(products);
})

app.post('/products', async (req: Request, res: Response) => {
    const productData = new CreateProductDto();
    productData.name = req.body.name;
    productData.price = req.body.price;
    const errors = await validate(productData);
    if (errors.length > 0) {
        const errorPayload = resolveValidationErrors(errors);
        return res.status(422).send(errorPayload);
    }
    console.log("errors:", errors);
    const product = myDataSource.getRepository(ProductEntity).create(req.body);
    const result = await myDataSource.getRepository(ProductEntity).save(product);
    return res.status(201).json(result);
})

function resolveValidationErrors(errors: ValidationError[]) {
    const validationErrors : { [key: string] : { [key: string]: string } } [] = [];
    if (errors.length > 0) {
        for (const error of errors) {
            if (error.constraints) {
                let constraintObj: {[key: string]: { [key: string]: string }} = {};
                constraintObj[error.property] = error.constraints;
                validationErrors.push(constraintObj)        
            }
        }
    }
    return {
        status: 422,
        error: true, 
        constraints: validationErrors
    };
}

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


app.listen(port, () => {
    console.log(`Server is up and running at port: ${port}`);
})