const Product = require('../models/products')
const Order = require('../models/orders')
const Catagory = require('../models/catagories')

exports.getAddProduct = (req, res, next) => {
   Catagory.find().select('title')
      .then(catagoryItems => {
         const editMode = req.query.edit
         res.render('admin/add-product', {title: 'add product', path: '/add-product', editMode, product: null, catagoryItems})
      })
}

exports.postAddProduct = (req, res, next) => {
   const {title, imgUrl, catagory, price, description} = req.body
   const product = new Product({
      title,
      imgUrl,
      catagoryId: catagory,
      price,
      description,
      userId: req.user._id
   })
   product.save()
      .then((result) => {
         Catagory.findByIdAndUpdate(result.catagoryId, {$push: {'products': {productId: result._id}}})
            .then(() => {
               res.redirect('/admin/products')
            })
      })
      .catch(err => console.log(err))
}

exports.getAdminProducts = (req, res, next) => {
   Product.find({'userId': req.user._id})
      .then(products => {
         res.render('admin/products', {title: 'admin products', path: '/products', products})
      })
      .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
   const productId = req.params.prodId
   const editMode = req.query.edit

   Product.findById(productId).populate('catagoryId', 'title -_id')
      .then(product => {
         Catagory.find().select('title')
            .then(catagoryItems => {
               res.render('admin/add-product', {title: 'edit product', path: '/add-product', editMode, product, catagoryItems})
            })
      })
      .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
   const {title, imgUrl, catagory ,price, description} = req.body
   let bool;
   let oldProductCatagory
   Product.findById(req.params.prodId)
      .then(product => {
         console.log(product.catagoryId)
         console.log(catagory)
         bool = product.catagoryId.toString() === catagory.toString()
         oldProductCatagory = product.catagoryId
         product.title = title,
         product.imgUrl = imgUrl,
         product.catagoryId = catagory,
         product.price = price,
         product.description = description
         return product.save()
      })
      .then(product => {
         // console.log(product.catagoryId)
         // console.log(product)
         if(!bool){
            return Catagory.findByIdAndUpdate(product.catagoryId, {$push: {'products': {productId: product._id}}})
               .then(() => {
                  console.log(bool)
                  return Catagory.findByIdAndUpdate(oldProductCatagory, {$pull: {'products': {productId: product._id}}})
               })
         }
         return;
      })
      .then(() => {
         res.redirect('/admin/products')
      })
      .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
   const _id = req.body.product
   const catagoryId = req.body.catagoryId
   Product.findByIdAndRemove(_id)
      .then(() => {
         console.log(_id, catagoryId)
         return Catagory.findByIdAndUpdate(catagoryId, {$pull:{'products': {productId: _id}}})
      })
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

exports.getEditManageProducts = (req, res, next) => {
   Order.find({'products.product.userId': req.user._id})
      .then(orders => {
         console.log(orders)
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
      .catch(err => console.log(err))
}























// console.log('sss' + {...updatedState}[0])
// console.log(updatedState)
// const x = Order.find({'products.product.userId': req.user._id})
// x.exec((err, orders) => console.log(orders))
// res.redirect('/')

// Order.find({'products.product.userId': req.user._id})
//    .then(orders => {
//       const updatedOrders = orders.map((order, index) => {
//          console.log({updatedState})
//          return {
//             products:{
//                product: order.products.product,
//                quantity: order.products.quantity,
//                state: updatedState[index]
//             },
//             user:{
//                userId: order.user.userId,
//                email: order.user.email,
//                address: order.user.address
//             }
//          }
//       })
//      //help 
//    })

// Order.find({'products.product.userId': req.user._id})
// .then(orders => {
//    .then(() => res.redirect('/admin/manage-products'))
// })