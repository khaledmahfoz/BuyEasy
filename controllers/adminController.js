const Product = require('../models/products')
const Order = require('../models/orders')

exports.getAddProduct = (req, res, next) => {
   const editMode = req.query.edit
   console.log(req.session)
   res.render('admin/add-product', {title: 'add product', path: '/add-product', editMode, product: null})
}

exports.postAddProduct = (req, res, next) => {
   const {title, imgUrl, price, description} = req.body
   const product = new Product({
      title,
      imgUrl,
      price,
      description,
      userId: req.user._id
   })
   product.save()
      .then(() => {
         res.redirect('/admin/products')
      })
      .catch(err => console.log(err))
}

exports.getAdminProducts = (req, res, next) => {
   Product.find()
      .then(products => {
         res.render('admin/products', {title: 'admin products', path: '/products', products})
      })
      .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
   const productId = req.params.prodId
   const editMode = req.query.edit

   Product.findById(productId)
      .then(product => {
         res.render('admin/add-product', {title: 'edit product', path: '/add-product', editMode, product})
      })
      .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
   const {title, imgUrl, price, description} = req.body
   console.log(title, req.params.prodId)
   Product.findById(req.params.prodId)
      .then(product => {
         product.title = title,
         product.imgUrl = imgUrl,
         product.price = price,
         product.description = description
         return product.save()
      })
      .then(() => {
         res.redirect('/admin/products')
      })
      .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
   console.log(req.body)
   const productId = req.body.product
   Product.findByIdAndRemove(productId)
      .then(() => {
         res.redirect('/admin/products')
      })
      .catch(err => console.log(err))
}

exports.getManageProducts = (req, res, next) => {
   Order.find({'products.product.userId': req.user._id})
      .then(orders => {
         res.render('admin/manage-products', {title: 'manage products', path: '/manage-products', orders})
      })
}