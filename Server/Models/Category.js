const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    CategoryName: String
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;