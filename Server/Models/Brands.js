const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Brand: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;