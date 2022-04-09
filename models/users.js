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
   isAdmin:{
      type: Boolean,
      required: false,
      default: false
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

userSchema.methods.addToCart = function(product) {
   const existedCart = [...this.cart.items]
   const productIndex = existedCart.findIndex(item => item.productId.toString() === product._id.toString())
   if(productIndex >= 0){
      existedCart[productIndex].quantity += 1
   }else{
      existedCart.push({productId: product._id, quantity: 1})
   }
   const updatedCart = {items: existedCart}
   this.cart = updatedCart
   return this.save()
}

userSchema.methods.removeFromCart = function(product) {
   let existedCart = [...this.cart.items]
   const productIndex = existedCart.findIndex(prod => prod.productId.toString() === product._id.toString())
   const targetedProduct = existedCart[productIndex]
   if(targetedProduct.quantity > 1){
      targetedProduct.quantity -= 1
   }else{
      existedCart = existedCart.filter(prod => prod.productId.toString() !== product._id.toString())
   }
   const updatedCart = {items: existedCart}
   this.cart = updatedCart
   return this.save()
}

userSchema.methods.clearCart = function() {
   this.cart = { items: [] };
   return this.save();
 };

module.exports = mongoose.model('User', userSchema);
