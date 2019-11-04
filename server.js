require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const Router = require('@koa/router');
const session = require("koa-session");
const shopifyHandle = require('./server/shopify-handle');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3001;

const server = new Koa();
const router = new Router();

server.use(session(server));

server
    .use(router.routes())
    .use(router.allowedMethods());

shopifyHandle(server, router);

server.use(async ctx => {
    ctx.respond = false;
    ctx.res.statusCode = 200;
});

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});
//https://shopify.luiztucillo.com.br/auth?shop=tucillo-stample-store.myshopify.com
