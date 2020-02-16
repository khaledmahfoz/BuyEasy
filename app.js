const express = require('express')
const path = require('path')
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const errorRoute = require('./routes/error')

const app = express()

app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter)
app.use(shopRouter)
app.use(errorRoute)


app.listen(8000);