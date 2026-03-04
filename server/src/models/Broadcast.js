const mongoose = require("mongoose");

const BroadcastSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

// Fast feed: per-channel time-ordered reads
BroadcastSchema.index({ channelId: 1, createdAt: -1 });
BroadcastSchema.index({ authorId: 1, createdAt: -1 });

module.exports = mongoose.model("Broadcast", BroadcastSchema);