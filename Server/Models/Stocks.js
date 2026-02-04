const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    cost: {
      type: Number,
      required: true,
      min: 0,
    },

    MRP: {
      type: Number,
      required: true,
      min: 0,
    },

    Unit: String,

    Barcode: {
      type: String,
      index: true,
    },

    Brand: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", StockSchema);
