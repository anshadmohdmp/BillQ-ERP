const mongoose = require("mongoose");

const ItemcategorySchema = new mongoose.Schema({
    Itemcategory: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Itemcategory = mongoose.model("Itemcategory", ItemcategorySchema);

module.exports = Itemcategory;