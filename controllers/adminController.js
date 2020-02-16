exports.getAddProduct = (req, res, next) => {
   res.render('admin/add-product', {title: 'add product', path: '/add-product'})
}

exports.postAddProduct = (req, res, next) => {
   res.send('<div>post product</div>')
}

exports.getAdminProducts = (req, res, next) => {
   res.render('admin/products', {title: 'admin products', path: '/products'})
}

exports.getManageProducts = (req, res, next) => {
   res.render('admin/manage-products', {title: 'manage products', path: '/manage-products'})
}