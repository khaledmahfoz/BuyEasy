const Product = require('../models/products')
const User = require('../models/users')
const Order = require('../models/orders')
const Catagory = require('../models/catagories')

exports.getShopProducts = (req, res, next) => {
   Product.find().populate('catagoryId').exec()
      .then(productsItems => {
         Catagory.find()
            .then(catagories => {
               res.render('shop/shop', {title: 'shop', path: '/', productsItems, catagories})
            })
      })
      .catch(err => next(err))
}

exports.getProductDetails = (req, res, next) => {
   Product.findById(req.params.prodId)
      .then(product => {
         res.render('shop/product-details', {title: 'product details', path: '/', product})
      })
      .catch(err => next(err))
}

exports.getCart = (req, res, next) => {
   req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
         let totalPrice = 0
         if(user.cart.items.length > 0){
            const totalPriceArray = user.cart.items.map(elem => {
               return elem.productId.price * elem.quantity
            })
            totalPrice = totalPriceArray.reduce((a, b) => a + b)
         }
         res.render('shop/cart', {title: 'cart', path: '/cart', cart: user.cart.items, totalPrice})
      })
}

exports.postOrders = (req, res, next) => {
   const {_id, email, address} = req.user
   req.user.populate('cart.items.productId').execPopulate()
      .then(user => {
         const products = user.cart.items.map(prod => {
            return {products: {
               product: {...prod.productId._doc}, 
               quantity: prod.quantity
            }, 
            user:{
               userId: _id, 
               email, 
               address
            }}
         })
         return Order.insertMany(products)
      })
      .then(() => {
         req.user.clearCart()
      })
      .then(() => {
         res.redirect('/orders')
      })
      .catch(err => next(err))
}

exports.postCart = (req, res, next) => {
   Product.findById(req.body.productId)
      .then(product => {
         req.user.addToCart(product)
      })
      .then(() => {
         res.redirect('/cart')
      })
      .catch(err => next(err))
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

exports.getCatagoryProducts = (req, res, next) => {
   const catagoryId = req.params.catagId
   
   Catagory.findById(catagoryId)
   .populate('products.productId')
   .exec()
      .then(catagory => {
         Catagory.find()
            .then(catagories => {
               const products = catagory.products.map(elem => elem.productId)
               res.render('shop/shop', {title: 'shop', path: '/', productsItems: products, catagories, catagPath: `/by-catagory/${catagoryId}`})
            })
      })
      .catch(err => next(err))
}

exports.postSearchProducts = (req, res, next) => {
   const productTitle = req.body.prodTitle
   Product.find({ title: { "$regex": productTitle, "$options": "i" } })
      .then(products => {
         res.render('shop/shop', {title: 'shop', path: '/', productsItems: products, catagories: null})
      })
}