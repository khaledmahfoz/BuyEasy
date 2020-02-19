const express = require('express')
const shopController = require('../controllers/shopController')
const router = express.Router()
const isAuth = require('../middlewares/isAuth')

router.get('/', shopController.getShopProducts)

router.get('/cart', isAuth, shopController.getCart)

router.get('/orders', isAuth, shopController.getOrders)

router.get('/product/:prodId', shopController.getProductDetails)

module.exports = router