exports.getShopProducts = (req, res, next) => {
   res.render('shop/shop', {title: 'shop', path: '/'})
}

exports.getCart = (req, res, next) => {
   res.render('shop/cart', {title: 'cart', path: '/cart'})
}

exports.getOrders = (req, res, next) => {
   res.render('shop/orders', {title: 'orders', path: '/orders'})
}