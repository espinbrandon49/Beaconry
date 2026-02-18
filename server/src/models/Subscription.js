const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Index: Subscriptions unique compound (userId, channelId)
SubscriptionSchema.index(
  { userId: 1, channelId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
