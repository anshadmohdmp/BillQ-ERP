const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    InvoiceNumber: String,
    date: Date,
    CustomerName: String,
    CustomerNumber: String,
    Stocks: [
        {   
            Barcode: String,
            productId: String,
            name: String,
            Brand: String,  
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
    TotalAmount: Number
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;