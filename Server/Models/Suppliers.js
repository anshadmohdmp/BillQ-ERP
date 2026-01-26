const mongoose = require("mongoose");

const SuppliersSchema = new mongoose.Schema({
    SupplierName: String,
    ContactPerson: String,
    ContactNumber: Number,
});

const Suppliers = mongoose.model("Suppliers", SuppliersSchema);

module.exports = Suppliers;