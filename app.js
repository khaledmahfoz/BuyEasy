const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const errorRoute = require('./routes/error')

const app = express()

app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))

app.use('/admin', adminRouter)
app.use(shopRouter)
app.use(errorRoute)

mongoose.connect('mongodb+srv://khaled:Manvsnature123@cluster0-kxm2s.mongodb.net/shop?retryWrites=true&w=majority')
   .then(() => {
      app.listen(8000)
   })
   .catch(err => console.log(err))