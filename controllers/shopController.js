const Product = require('../models/products')
const User = require('../models/users')
const Order = require('../models/orders')

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
   req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
         res.render('shop/cart', {title: 'cart', path: '/cart', cart: user.cart.items})
      })
}

exports.postOrders = (req, res, next) => {
   const {_id, email, address, cart} = req.user
   req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      let products = user.cart.items.map(elem => {
         return {product: {...elem.productId._doc}, quantity: elem.quantity}   
      })
      const order = new Order({
         products: products,
         user: {
            userId: _id,
            email: email,
            address: address
         }
      })
      return order.save()
   })
   .then(() => {
      res.redirect('/orders')
   })
}

exports.postCart = (req, res, next) => {
   Product.findById(req.body.productId)
      .then(product => {
         req.user.addToCart(product)
      })
      .then(() => {
         res.redirect('/cart')
      })
      .catch(err => console.log(err))
}

exports.deleteCart = (req, res, next) => {
   Product.findById(req.body.productId)
      .then(product => {
         req.user.removeFromCart(product)
      })
      .then(() => {
         res.redirect('/cart')
      })
}

exports.getOrders = (req, res, next) => {
   Order.find({'user.userId': req.user._id})
      .then(orders => {
         res.render('shop/orders', {title: 'orders', path: '/orders', orders})
      })
}