const Product = require('../models/products')
const Order = require('../models/orders')
const Catagory = require('../models/catagories')
const {validationResult} = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
   Catagory.find().select('title')
      .then(catagoryItems => {
         const editMode = req.query.edit
         res.render('admin/add-product', {title: 'add product', path: '/add-product', editMode, product: null, catagoryItems, data: null, errors: null})
      })
      .catch(err => next(err))
}

exports.postAddProduct = (req, res, next) => {
   const {title, catagory, price, description} = req.body
   const errors = validationResult(req)
   console.log(req.file)
   console.log(req.file.filename)
   console.log(req.file.filename.replace(/\s/g, ""))

   if(errors.isEmpty()){
      const product = new Product({
         title,
         imgUrl: '/'+req.file.filename.replace(/\s/g, ""),
         catagoryId: catagory,
         price,
         description,
         userId: req.user._id
      })
      return product.save()
         .then((result) => {
            return Catagory.findByIdAndUpdate(result.catagoryId, {$push: {'products': {productId: result._id}}})
               .then(() => {
                  return res.redirect('/admin/products')
               })
         })
         .catch(err => next(err))
   }else{
      const data = {
         title,
         price,
         description,
      }
      return Catagory.find().select('title')
      .then(catagoryItems => {
         const editMode = req.query.edit
         return res.status(422).render('admin/add-product', {title: 'add product', path: '/add-product', editMode, product: null, catagoryItems, data, errors: errors.array()})
      })
      .catch(err => next(err))
   }
}

exports.getAdminProducts = (req, res, next) => {
   Product.find({'userId': req.user._id})
      .then(products => {
         res.render('admin/products', {title: 'admin products', path: '/products', products})
      })
      .catch(err => next(err))
}

exports.getEditProduct = (req, res, next) => {
   const productId = req.params.prodId
   const editMode = req.query.edit
   Product.findById(productId).populate('catagoryId', 'title userId -_id')
      .then(product => {
         if(req.user._id.toString() !== product.userId.toString()){
            return res.redirect('/login')
         }
         Catagory.find().select('title')
            .then(catagoryItems => {
               res.render('admin/add-product', {title: 'edit product', path: '/add-product', editMode, product, catagoryItems, data: null, errors: null})
            })
      })
      .catch(err => next(err))
}

exports.postEditProduct = (req, res, next) => {
   const {title, catagory, price, description} = req.body
   let bool
   let oldProductCatagory
   const errors = validationResult(req)
   
   const data = {
      title,
      catagoryId: catagory,
      price,
      description
   }

   if(errors.isEmpty()){
      return Product.findById(req.params.prodId)
         .then(product => {
            bool = product.catagoryId.toString() === catagory.toString()
            oldProductCatagory = product.catagoryId
            product.title = title,
            product.imgUrl = req.file ? '/'+req.file.filename.replace(/\s/g, "") : product.imgUrl,
            product.catagoryId = catagory,
            product.price = price,
            product.description = description
            return product.save()
         })
         .then(product => {
            if(!bool){
               return Catagory.findByIdAndUpdate(product.catagoryId, {$push: {'products': {productId: product._id}}})
                  .then(() => {
                     return Catagory.findByIdAndUpdate(oldProductCatagory, {$pull: {'products': {productId: product._id}}})
                  })
            }
            return;
         })
         .then(() => {
            return res.redirect('/admin/products')
         })
         .catch(err => next(err))
   }else{
      const editMode = req.query.edit
      return Product.findById(req.params.prodId).populate('catagoryId', 'title -_id')
      .then(product => {
         Catagory.find().select('title')
            .then(catagoryItems => {
               return res.status(422).render('admin/add-product', {title: 'edit product', path: '/add-product', editMode, product, catagoryItems, data, errors: errors.array()})
            })
      })
      .catch(err => next(err))
   }
}

exports.deleteProduct = (req, res, next) => {
   const {_id, userId} = JSON.parse(req.body.product)
   const catagoryId = req.body.catagoryId

   if(req.user._id.toString() !== userId.toString()){
      return res.redirect('/login')
   }
   Product.findByIdAndRemove(_id)
      .then(() => {
         return Catagory.findByIdAndUpdate(catagoryId, {$pull:{'products': {productId: _id}}})
      })
      .then(() => {
         res.redirect('/admin/products')
      })
      .catch(err => next(err))
}

exports.getManageProducts = (req, res, next) => {
   Order.find({'products.product.userId': req.user._id})
      .then(orders => {
         res.render('admin/manage-products', {title: 'manage products', path: '/manage-products', orders})
      })
}

exports.getEditManageProducts = (req, res, next) => {
   Order.find({'products.product.userId': req.user._id})
      .then(orders => {
         res.render('admin/edit-manage-products', {title: 'manage products', path: '/manage-products', orders})
      })
}

exports.postEditManageProducts = (req, res, next) => {
   Order.find({'products.product.userId': req.user._id})
      .then(orders => {
         orders.map(order => {
            const state = order._id
            order.products.state = req.body[state]
            return order.save()
         })
      })
      .then(() => res.redirect('/admin/manage-products'))
      .catch(err => next(err))
}
