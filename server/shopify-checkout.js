module.exports = (server, router) => {
    router.get('/checkout', (ctx, next) => {
        console.log('checkout');
        ctx.status = 200;
        ctx.body = 'CHECKOUT';
    });
};
