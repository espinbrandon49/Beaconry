const express = require("express");
const Broadcast = require("../models/Broadcast");
const Subscription = require("../models/Subscription");
const requireAuth = require("../middleware/requireAuth");
const requireBroadcaster = require("../middleware/requireBroadcaster");

const router = express.Router();

// CREATE (broadcaster-only, authorId is server-derived)
router.post("/", requireAuth, requireBroadcaster, async (req, res) => {
  try {
    const { channelId, body } = req.body;

    const created = await Broadcast.create({
      channelId,
      body,
      authorId: req.user._id
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FEED (auth-only): broadcasts from channels I'm subscribed to
router.get("/feed", requireAuth, async (req, res) => {
  const subs = await Subscription.find({ userId: req.user._id }).select(
    "channelId"
  );

  const channelIds = subs.map((s) => s.channelId);

  const broadcasts = await Broadcast.find({ channelId: { $in: channelIds } })
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(broadcasts);
});

// GET ONE
router.get("/:id", requireAuth, async (req, res) => {
  const broadcast = await Broadcast.findById(req.params.id);
  if (!broadcast) return res.status(404).json({ error: "Not found" });
  res.json(broadcast);
});

// DELETE
router.delete("/:id", requireAuth, requireBroadcaster, async (req, res) => {
  const deleted = await Broadcast.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
