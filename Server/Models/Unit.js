const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    UnitName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;