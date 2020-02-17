const Product = require('../models/products')

exports.getShopProducts = (req, res, next) => {
   Product.find()
      .then(products => {
         res.render('shop/shop', {title: 'shop', path: '/', products})
      })
      .catch(err => console.log(err))
}

exports.getProductDetails = (req, res, next) => {
   Product.findById(req.params.prodId)
      .then(product => {
         res.render('shop/product-details', {title: 'product details', path: '/', product})
      })
      .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
   res.render('shop/cart', {title: 'cart', path: '/cart'})
}

exports.getOrders = (req, res, next) => {
   res.render('shop/orders', {title: 'orders', path: '/orders'})
}