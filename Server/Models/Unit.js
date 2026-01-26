const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
    UnitName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;