const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const User = require('./models/users')
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const errorRoute = require('./routes/error')

const db = 'mongodb+srv://khaled:Manvsnature123@cluster0-kxm2s.mongodb.net/shop'

const app = express()
app.set('view engine', 'pug')

const store = new mongoDBStore({
   uri: db,
   collection: 'sessions'
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({secret: 'mysec', resave: false, saveUninitialized: false, store: store}))
app.use(csrf())
app.use((req, res, next) => {
   res.locals.isLoggedIn = req.session.isLoggedIn
   res.locals.csrfToken = req.csrfToken()
   next()
})

app.use((req, res, next) => {
   if (!req.session.user) {
     return next();
   }
   User.findById(req.session.user._id)
     .then(user => {
       req.user = user;
       next();
     })
     .catch(err => console.log(err));
 });

app.use('/admin', adminRouter)
app.use(shopRouter)
app.use(authRouter)
app.use(errorRoute)

mongoose.connect(db)
   .then(() => {
      app.listen(8000)
   })
   .catch(err => console.log(err))