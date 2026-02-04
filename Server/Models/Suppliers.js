const mongoose = require("mongoose");

const SuppliersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    SupplierName: String,
    ContactPerson: String,
    ContactNumber: Number,
});

const Suppliers = mongoose.model("Suppliers", SuppliersSchema);

module.exports = Suppliers;