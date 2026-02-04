const mongoose = require("mongoose");

const ItemcategorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Itemcategory: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Itemcategory = mongoose.model("Itemcategory", ItemcategorySchema);

module.exports = Itemcategory;