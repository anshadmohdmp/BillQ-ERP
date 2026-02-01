const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  Barcode: { type: String, default: null },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
  name: { type: String, required: true },
  Brand: { type: String, default: "" },    // <-- NEW field
  Unit: { type: String, default: "" },
  quantity: { type: Number, required: true },
  cost: { type: Number, default: 0 },
  MRP: { type: Number, default: 0 },
}, { timestamps: true });

const StockModel = mongoose.model("Stock", StockSchema);
module.exports = StockModel;
