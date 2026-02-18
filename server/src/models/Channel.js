const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

// Index: Channels unique slug
ChannelSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Channel", ChannelSchema);
