const express = require('express')
const shopController = require('../controllers/shopController')
const router = express.Router()

router.get('/', shopController.getShopProducts)

router.get('/cart', shopController.getCart)

router.get('/orders', shopController.getOrders)

router.get('/product/:prodId', shopController.getProductDetails)

module.exports = router