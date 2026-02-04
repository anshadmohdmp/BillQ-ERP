const mongoose = require("mongoose");

const CustomersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    CustomerName: String,
    CustomerAddress: String,
    CustomerNumber: Number,
});

const Customers = mongoose.model("Customers", CustomersSchema);

module.exports = Customers;