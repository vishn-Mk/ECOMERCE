const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    image: {
        type: String, 
        required: false 
    },
    seller: {
        type: String,
        required: false 
    },
    review: {
        type: String,
        required: false 
    },
   
    category: {
        type: String,
        required: false 
    },
    rate: {
        type: String,
        required: false 
    },
    quantity: {
        type: String,
        required: false 
    }
});
var productDB=mongoose.model('Product', productSchema);
module.exports = productDB