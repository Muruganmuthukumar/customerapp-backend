const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true, 
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;