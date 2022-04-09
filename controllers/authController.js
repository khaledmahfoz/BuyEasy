const User = require('../models/users');
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check')

exports.getSignup = (req, res, next) => {
   res.render('auth/signup', {title: 'signup', path: '/signup', data: null, errors: null})
}

exports.postSignup = (req, res, next) => {
   const {username, email, password, confirmPass, address} = req.body
   const errors = validationResult(req)
   const data = {
      username,
      email,
      password,
      confirmPass,
      address
   }
   if(errors.isEmpty()){
      return bcrypt.hash(password, 12)
         .then(hashPass => {
            const user = new User({
               username,
               email,
               password: hashPass,
               address      
            })
            return user.save()
               .then(() => res.redirect('/login'))
               .catch(err => next(err))
         })
   }else{
      res.status(422).render('auth/signup', {title: 'signup', path: '/signup', data, errors: errors.array()})
   }
}

exports.getLogin = (req, res, next) => {
   res.render('auth/login', {title: 'Login', path: '/login', data: null, errors: null})
}

exports.postLogin = (req, res, next) => {
   const {email, password} = req.body;
   const errors = validationResult(req)
   const data = {
      email,
      password
   }
   if(errors.isEmpty()){
      res.redirect('/')
   }else{
      res.status(422).render('auth/login', {title: 'Login', path: '/login', data, errors: errors.array()})
   }
}

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      res.redirect('/login')
   })
}