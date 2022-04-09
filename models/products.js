const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   imgUrl: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   catagoryId:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Catagory'
   },
   userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   }
})

module.exports = mongoose.model('Product', productSchema);
