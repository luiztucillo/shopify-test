const {default: shopifyAuth} = require("@shopify/koa-shopify-auth");
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
const {default: graphQLProxy} = require("@shopify/koa-shopify-graphql-proxy");
const {ApiVersion} = require("@shopify/koa-shopify-graphql-proxy");
const {verifyRequest} = require("@shopify/koa-shopify-auth");
const shopifyRouting = require('./shopify-routing');
const dotenv = require("dotenv");

dotenv.config();

const {SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY} = process.env;

const auth = function auth(ctx) {
    return shopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: ['write_orders, write_products'],
        async afterAuth(ctx) {
            const {shop, accessToken} = ctx.session;

            try {
                // await fetch('https://');
                const registration = await registerWebhook({
                    address: `https://${shop}/webhooks/products/update`,
                    topic: 'PRODUCTS_UPDATE',
                    accessToken,
                    shop,
                    apiVersion: ApiVersion.October19,
                });

                if (registration.success) {
                    console.log('Successfully registered webhook!');
                } else {
                    console.log('Failed to register webhook', registration.result);
                }
            } catch (e) {
                console.log(e);
            }

            ctx.cookies.set("shopOrigin", shop, {httpOnly: false});
            ctx.redirect("/");
        }
    });
};

const webhooks = () => {
    return receiveWebhook({
        path: '/webhooks/products/update',
        secret: SHOPIFY_API_SECRET_KEY,
        onReceived(ctx) {
            console.log('received webhook: ', ctx.state.webhook);
        }
    });
};

module.exports = (server, router) => {
    server.keys = [SHOPIFY_API_SECRET_KEY];

    //Attaching the middleware will proxy any requests sent to /graphql on your app to the current logged in shop found in session.
    server.use(graphQLProxy({version: ApiVersion.October19}));

    //middleware to shopify oauth
    server.use(auth());

    //receive webhooks from shopify
    server.use(webhooks());

    //validate requests following shopify security rules
    server.use(verifyRequest());

    shopifyRouting(server, router);
};
