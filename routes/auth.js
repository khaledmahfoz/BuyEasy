const express = require('express')
const bcrypt = require('bcryptjs')
const authController = require('../controllers/authController')
const User = require('../models/users')
const {check} = require('express-validator/check')
const router = express.Router()

router.get('/signup', authController.getSignup)

router.post(
   '/signup', 
   [
      check('username', "username shouldn't contain any numbers or whitspaces")
         .trim()
         .isAlpha(),
      check('email')
         .isEmail()
            .withMessage('please insert valid email')
         .custom((value, {req}) => {
            return User.findOne({email: req.body.email})
               .then(user => {
                  if(user){
                     return Promise.reject('Email already Exist!')
                  }
                  return true
               })
         }),
      check('password', 'password must be above 5 characters')
         .isLength({min: 5, max: undefined})
         .isAlphanumeric(),
      check('confirmPass')
         .custom((value, {req}) => {
            if(value !== req.body.password){
               throw new Error("Passwords don't match")
            }
            return true
         }),
      check('address', 'address must be above 10 characters')
         .isLength({min: 10, max: undefined})
   ], 
   authController.postSignup)

router.get('/login', authController.getLogin)

router.post(
   '/login',
   [
      check('email')
         .custom((value, {req}) => {
            return User.findOne({email: req.body.email})
            .then(user => {
               if(!user){
                  return Promise.reject('Email doesn\'t Exist')
               }
               return true
            })
         }),
      check('password')
         .custom((value, {req}) => {
            return User.findOne({email: req.body.email})
               .then(user => {
                  if(user){
                     return bcrypt.compare(value, user.password)
                        .then(doMatch => {
                           if(!doMatch){
                              return Promise.reject('password is incorrect')
                           }
                           req.session.isLoggedIn = true
                           req.session.user = user
                           return req.session.save(err => {
                              if(err){
                                 return false
                              }
                              return true
                           })
                        })
                  }
                  return false
               })
         })
   ], 
   authController.postLogin)

router.post('/logout', authController.postLogout)

module.exports = router