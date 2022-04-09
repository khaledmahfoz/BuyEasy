const express = require('express')
const shopController = require('../controllers/shopController')
const router = express.Router()
const isAuth = require('../middlewares/isAuth')

router.get('/', shopController.getShopProducts)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.post('/cart-delete', isAuth, shopController.deleteCart)

router.get('/orders', isAuth, shopController.getOrders)

router.post('/orders', isAuth, shopController.postOrders)

router.get('/product/:prodId', shopController.getProductDetails)

router.get('/by-catagory/:catagId', shopController.getCatagoryProducts)

router.post('/search', shopController.postSearchProducts)

module.exports = router