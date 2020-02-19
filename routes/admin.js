const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const isAuth = require('../middlewares/isAuth')

router.get('/add-product', isAuth, adminController.getAddProduct)

router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:prodId', isAuth, adminController.getEditProduct)

router.post('/edit-product/:prodId', isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.deleteProduct)

router.get('/products', isAuth, adminController.getAdminProducts)

router.get('/manage-products', isAuth, adminController.getManageProducts)

module.exports = router