const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
        cost: Number, // ✅ LOWERCASE (FIXED)
      },
    ],

    Subtotal: Number,
    Tax: Number,
    Discount: Number,
    PaymentMethod: String,
    TotalAmount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
