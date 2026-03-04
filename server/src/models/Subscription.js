const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    }
  },
  { timestamps: true }
);

// Index: Subscriptions unique compound (userId, channelId)
// Fast lookups for "my subs" + access checks + prevent duplicates
SubscriptionSchema.index({ userId: 1, channelId: 1 }, { unique: true });
SubscriptionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Subscription", SubscriptionSchema);
