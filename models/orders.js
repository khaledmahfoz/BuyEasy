const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      state: {type: String, required: true, default: 'pending'}
  },
  user: {
   userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
    email: {
      type: String,
      required: true
    },
    address:{
      type: String,
      required: true
   }
  }
});

module.exports = mongoose.model('Order', orderSchema);
