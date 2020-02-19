const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
   username:{
      type: String,
      required: true
   },
   email:{
      type: String,
      unique: true,
      required: true
   },
   password:{
      type: String,
      required: true
   },
   address:{
      type: String,
      required: true
   },
   cart: {
      items: [
        {
            productId: {
               type: Schema.Types.ObjectId,
               ref: 'Product',
               required: true
            },
            quantity: { 
               type: Number,
               required: true 
            }
        }
      ]
   }
})

module.exports = mongoose.model('User', userSchema);
