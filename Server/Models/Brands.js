const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    Brand: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;