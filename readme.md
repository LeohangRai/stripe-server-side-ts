## Getting Started
First, sign up for an account on **<a href="https://dashboard.stripe.com/register" target="_blank" title="Stripe Signup Page">Stripe</a>**. Once you are logged in, you will have access to the Stripe **<a href="https://dashboard.stripe.com" target="_blank" title="Stripe Dashboard">Dashboard</a>** where you can find all of your API Keys and payment transaction information.

*Note that, when you open up a brand new account, you will initially always be in **Test mode**. To accept real payments from real customers, you will have to activate your account. For this, you will have to submit a bunch of data about your business and complete your Stripe profile*.


### Credentials
After you have signed up, you can look at all of your credentials or API Keys on the Stripe Dashboard **<a href="https://dashboard.stripe.com/test/apikeys" target="_blank" title="Stripe API Keys">here</a>**. There, you will find the following API Keys:
- Publishable Key
- Secret Key

The ```Secret Key``` is the one you will use on your backend and the ```Publishable Key``` is the one you use on your front end or the client side.
On this project's ```.env``` file, I have set a ```STRIPE_SECRET_KEY``` variable and a ```STRIPE_PUBLIC_KEY``` variable for storing these API Keys.

### Installation
```bash
$ npm install
```

### Running the app

```bash
# development
$ npm start

# watch mode
$ npm run start:dev
```

#### Stripe Checkout
Stripe Checkout is a low-code payment integration that creates a customizable payment page hosted on Stripe.
Checkout supports one-time payments and subscriptions for global customer base with coverage on over 20% local payment methods.

###### Checkout lifecycle:
- When customers are ready to complete their purchase, your application (server-side) creates a new Checkout Session.
- The Checkout Session provides a URL that redirects customers to a Stripe-hosted payment page.
- The Checkout page displays a payment form to your customers, runs card valdation, handles errors and more.
- Customers enter their payment details on the payment page and complete the transaction.
- After the transaction, a webhook fulfills the order, using the    ```checkout.session.completed``` event.

###### Brand customization
- If you want to customize your branding *(custom logos, icons, theme color and stuff to be used in the Stripe-Checkout page)*, you can do that on your Stripe branding settings **<a href="https://dashboard.stripe.com/settings/branding" target="_blank" title="Stripe Brand Customization">here</a>**.

Read more about Stripe Checkout and its lifecycle and how it works **<a href="https://stripe.com/docs/payments/checkout" target="_blank" title="Stripe Checkout Docs">here</a>**.

### Web Hooks
You can fulfill orders by running webhooks after the ```checkout.session.completed``` event sends a notification. Webhooks are basically HTTP calls that run when an **<a href="https://stripe.com/docs/api/events" target="_blank" title="Stripe Checkout Docs">event</a>** occurs. You can then use these notifications to execute actions in your backend accordingly.

*For example, if a customer doesn't make a purchase and their cart expires, you can set a webhook on the ```checkout.session.expired``` event and then return items to your inventory or maybe send them a cart abandonment email.*

###### How it works:
A Webhook is a real-time push notification sent to your application as a JSON payload through HTTPs requests.
- You will register your computer as an event listener by setting up **<a href="https://stripe.com/docs/stripe-cli" target="_blank" title="Stripe CLI Docs">Stripe-CLI</a>** on your machine. 
- Whenever a payment related event is triggered, a webhook will run which your registered computer will be listening to.
- You need to forward all the Webhook HTTP requests coming into your machine to the host and port where your server is running as:
```sh
$ stripe listen --forward-to localhost:3000/stripe/webhook
```

See how to setup Stripe-CLI on your machine **<a href="https://stripe.com/docs/stripe-cli" target="_blank" title="Stripe CLI Setup">here</a>**.

*Using the Stripe-CLI, you can even manually trigger events such as the ```payment_intent.succeeded``` and ```payment_intent.created``` events to test your Webhook API. How cool is that?*

###### Securing Webhooks by using Signatures
Stripe can optionally sign the Webhook events it sends to your endpoints by including a signature in each event's ```Stripe-Signature``` header. This allows you to verify that the events were sent by Stripe and not by a third party.

Before you can verify signatures, you need to retrieve your endpoint's secret from your Dashboard's **<a href="https://dashboard.stripe.com/test/webhooks" target="_blank" title="Stripe Webhooks Dashboard">Webhooks Settings</a>**. Select an endpoint that you want to obtain the secret for or create a new endpoint. You can find your endpoint secret key on the sample endpoint section.

You can also see your webhook secret while running the ```stripe listen``` command on your machine. 
You will usually do this as:
```sh
$ stripe listen --forward-to <your_server_url>/<webhook_endpoint>
```
On this project's ```.env``` file, I have set a ```ENDPOINT_SECRET_KEY``` variable for storing the Webhook secret.

Stripe generates a unique secret key for each endpoint. If you use the same endpoint for both test and live API keys, note that the secret is different for each one. Additionally, if you use multiple endpoints, you must obtain a secret for each one you want to verify signatures on. After this setup, Stripe starts to sign each webhook it sends to the endpoint.

###### Gotchas
Stripe requires the raw body of the request to perform signature verifiction. If you're using a framework, make sure it doesn't manipulate the raw body. Any manipulation to the raw body of the request causes the verification to fail.

In **Express.js**, this means you cannot be doing ```app.use(express.json())``` on the global scope ahead of the Stripe Webhook route. 
You might as well use a raw body parser middleware, such as the ```express.raw({ type: 'application/json' })``` before your webhook route like I have done in this project.

***`src/routes/stripe-webhook.route.ts`***
```ts
router
  .route('/stripe')
  .post(
    express.raw({ type: 'application/json' }),
    wrapNext(stripeWebhookHandler)
  );
```

***`src/index.ts`***
```ts
/* 
had to register the stripe webhook route before express.json() or the bodyParser 
because stripe-webhook requires raw body for validating signatures
*/
app.use('/webhooks', webhookRouter);
app.use(express.json());

// other routes
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/payments', paymentRouter);
```

If you want to find out more about Stripe webhooks, you can find the Webhooks quick start guide **<a href="https://stripe.com/docs/webhooks/quickstart" target="_blank" title="Stripe Webhooks Quick Start">here</a>**.