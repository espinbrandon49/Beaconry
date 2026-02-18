const mongoose = require("mongoose");

const BroadcastSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
      index: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    }
  },
  { timestamps: true }
);

// Index: Broadcasts (channelId, createdAt DESC)
BroadcastSchema.index({ channelId: 1, createdAt: -1 });

module.exports = mongoose.model("Broadcast", BroadcastSchema);
