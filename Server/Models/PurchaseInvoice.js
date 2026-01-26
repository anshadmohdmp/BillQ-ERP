const mongoose = require("mongoose");

const PurchaseInvoiceSchema = new mongoose.Schema({
  InvoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  SupplierName: {
    type: String,
    required: true,
  },
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
  Subtotal: {
    type: Number,
    required: true,
  },
  Tax: {
    type: Number,
    default: 0,
  },
  Discount: {
    type: Number,
    default: 0,
  },
  PaymentMethod: {
    type: String,
    enum: ["Cash", "Card", "UPI"],
    default: "Cash",
  },
  TotalAmount: {
    type: Number,
    required: true,
  },
});

const PurchaseInvoice = mongoose.model("PurchaseInvoice", PurchaseInvoiceSchema);
module.exports = PurchaseInvoice;