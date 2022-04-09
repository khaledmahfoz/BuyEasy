const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catagorySchema = new Schema({
   title: {
      type: String,
      required: true
   },
   products: [
      {
         productId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
         }
      }
   ]
})

module.exports = mongoose.model('Catagory', catagorySchema);
