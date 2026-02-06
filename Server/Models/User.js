const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Normal signup
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String }, // ❗ not required for Google users

    // Google auth
    googleId: { type: String, unique: true, sparse: true },

    // Password reset
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
