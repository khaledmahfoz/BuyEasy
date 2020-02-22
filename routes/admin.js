const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')

router.get('/add-product', isAdmin, adminController.getAddProduct)

router.post('/add-product', isAdmin, adminController.postAddProduct)

router.get('/edit-product/:prodId', isAdmin, adminController.getEditProduct)

router.post('/edit-product/:prodId', isAdmin, adminController.postEditProduct)

router.post('/delete-product', isAdmin, adminController.deleteProduct)

router.get('/products', isAdmin, adminController.getAdminProducts)

router.get('/manage-products', isAdmin, adminController.getManageProducts)

module.exports = router