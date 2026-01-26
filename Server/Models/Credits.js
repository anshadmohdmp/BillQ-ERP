const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
    InvoiceNumber: String,
    date: Date,
    CustomerName: String,
    CustomerNumber: String,
    Stocks: [
        {   
            Barcode: String,
            productId: String,
            name: String,
            quantity: Number,
            Unit: String,
            price: Number,
            Cost: Number,
        },
    ],
    Tax: Number,
    Subtotal: Number,
    Discount: Number, 
    PaymentMethod: String,
    TotalAmount: Number,
});

const Credits = mongoose.model("Credits", CreditSchema);

module.exports = Credits;