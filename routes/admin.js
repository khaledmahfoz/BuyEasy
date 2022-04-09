const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')
const {check} = require('express-validator/check')

router.get('/add-product', isAdmin, adminController.getAddProduct)

router.post(
   '/add-product', 
   isAdmin, 
   [
      check('title')
         .isLength({min: 5, max: undefined})
         .withMessage('title should be more than 5 characters'),
      check('image', 'please select an image')
         .custom((value, {req}) => {
            return req.file
         }),
      check('price', 'price should be numeric value')
         .isNumeric(),
      check('description')
         .isLength({min: 10, max: undefined})
         .withMessage('description should be more than 10 characters')
   ], 
   adminController.postAddProduct)

router.get('/edit-product/:prodId', isAdmin, adminController.getEditProduct)

router.post(
   '/edit-product/:prodId', 
   isAdmin,
   [
      check('title')
         .isLength({min: 5, max: undefined})
         .withMessage('title should be more than 5 characters'),
      check('price', 'price should be numeric value')
         .isNumeric(),
      check('description')
         .isLength({min: 10, max: undefined})
         .withMessage('description should be more than 10 characters')
   ],  
   adminController.postEditProduct)

router.post('/delete-product', isAdmin, adminController.deleteProduct)

router.get('/products', isAdmin, adminController.getAdminProducts)

router.get('/manage-products', isAdmin, adminController.getManageProducts)

router.get('/edit-manage-products', isAdmin, adminController.getEditManageProducts)

router.post('/edit-manage-products', isAdmin, adminController.postEditManageProducts)

module.exports = router