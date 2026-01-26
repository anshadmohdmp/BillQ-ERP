const mongoose = require("mongoose");

const CustomersSchema = new mongoose.Schema({
    CustomerName: String,
    CustomerAddress: String,
    CustomerNumber: Number,
});

const Customers = mongoose.model("Customers", CustomersSchema);

module.exports = Customers;