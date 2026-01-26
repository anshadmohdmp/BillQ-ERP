const mongoose = require("mongoose");
const Unit = require("./Unit");

const productSchema = new mongoose.Schema({
    Barcode: String,
    ProductName: String,
    Unit: String,
    Cost: Number,
    MRP: Number,
    Category: String,
    Brand: String,
    ItemCategory: String,
    Supplier: String
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;