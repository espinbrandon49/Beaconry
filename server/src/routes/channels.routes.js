const express = require("express");
const Channel = require("../models/Channel");
const Subscription = require("../models/Subscription");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// LIST my channels (subscriber view)
router.get("/mine", requireAuth, async (req, res) => {
  const subs = await Subscription.find({ userId: req.user._id }).select(
    "channelId"
  );

  const channelIds = subs.map((s) => s.channelId);

  const channels = await Channel.find({ _id: { $in: channelIds } }).sort({
    createdAt: -1
  });

  res.json(channels);
});

// GET ONE: broadcaster OR subscribed user only (stealth 404)
router.get("/:id", requireAuth, async (req, res) => {
  // Broadcasters can fetch any channel
  if (req.user.isBroadcaster) {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: "Not found" });
    return res.json(channel);
  }

  // Subscribers must be subscribed to fetch the channel
  const sub = await Subscription.findOne({
    userId: req.user._id,
    channelId: req.params.id
  });

  if (!sub) return res.status(404).json({ error: "Not found" });

  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).json({ error: "Not found" });
  res.json(channel);
});

module.exports = router;