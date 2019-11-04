const themeLoader = require('./themeing');

module.exports = (server, router) => {

    router.get('/', async (ctx, next) => {
        ctx.body = 'oi';
    });

    router.get('/checkout', async (ctx, next) => {
        ctx.set('Content-Type', 'application/liquid');
        ctx.status = 200;
        ctx.body = await themeLoader('checkout.liquid');
    });
};
