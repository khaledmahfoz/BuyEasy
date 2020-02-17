const Product = require('../models/products')

exports.getAddProduct = (req, res, next) => {
   res.render('admin/add-product', {title: 'add product', path: '/add-product'})
}

exports.postAddProduct = (req, res, next) => {
   const {title, imgUrl, price, description} = req.body
   const product = new Product({
      title,
      imgUrl,
      price,
      description
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

exports.getManageProducts = (req, res, next) => {
   res.render('admin/manage-products', {title: 'manage products', path: '/manage-products'})
}