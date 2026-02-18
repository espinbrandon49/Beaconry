const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["subscriber", "broadcaster"],
      default: "subscriber"
    }
  },
  { timestamps: true }
);

// Index: Users unique email
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
