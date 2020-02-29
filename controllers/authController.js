const User = require('../models/users');
const bcrypt = require('bcryptjs')

exports.getSignup = (req, res, next) => {
   res.render('auth/signup', {title: 'signup', path: '/signup'})
}

exports.postSignup = (req, res, next) => {
   const {username, email, password, confirmPass, address} = req.body
   User.findOne({email: email})
      .then((userDoc) => {
         if(userDoc || confirmPass !== password){
            return res.redirect('/signup')
         }
         return bcrypt.hash(password, 12)
         .then(hashPass => {
            const user = new User({
               username,
               email,
               password: hashPass,
               address      
            })
            return user.save()
         })
         .then(() => res.redirect('/login'))
      })
      .catch(err => console.log(err))
}

exports.getLogin = (req, res, next) => {
   res.render('auth/login', {title: 'Login', path: '/login'})
}

exports.postLogin = (req, res, next) => {
   const {email, password} = req.body;
   User.findOne({email: email})
      .then(user => {
         if(!user){
            return res.redirect('/login')
         }
         return bcrypt.compare(password, user.password)
            .then((doMatch) => {
               if(doMatch){
                  req.session.isLoggedIn = true
                  req.session.user = user
                  return req.session.save(err => {
                     return res.redirect('/')
                  })
               }
               return res.redirect('/login')
            })
      })
      .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      res.redirect('/login')
   })
}