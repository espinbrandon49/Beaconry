const express = require("express");
const Broadcast = require("../models/Broadcast");
const Subscription = require("../models/Subscription");
const requireAuth = require("../middleware/requireAuth");
const requireBroadcaster = require("../middleware/requireBroadcaster");

const router = express.Router();

// CREATE (broadcaster-only, authorId is server-derived)
router.post("/", requireAuth, requireBroadcaster, async (req, res) => {
  try {
    const { channelId, content } = req.body;

    if (!channelId || !content) {
      return res.status(400).json({ error: "channelId and content required" });
    }
    
    const created = await Broadcast.create({
      channelId,
      content,
      authorId: req.user._id,
    });

    req.app
      .get("io")
      .to(`channel:${channelId}`)
      .emit("broadcast:create", created);

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FEED (auth-only): broadcasts from channels I'm subscribed to
router.get("/feed", requireAuth, async (req, res) => {
  const subs = await Subscription.find({ userId: req.user._id }).select(
    "channelId",
  );

  const channelIds = subs.map((s) => s.channelId);

  const broadcasts = await Broadcast.find({ channelId: { $in: channelIds } })
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(broadcasts);
});

// GET ONE: broadcaster OR subscribed-to-channel user only (stealth 404)
router.get("/:id", requireAuth, async (req, res) => {
  const broadcast = await Broadcast.findById(req.params.id);
  if (!broadcast) return res.status(404).json({ error: "Not found" });

  if (req.user.isBroadcaster) {
    return res.json(broadcast);
  }

  const sub = await Subscription.findOne({
    userId: req.user._id,
    channelId: broadcast.channelId,
  });

  if (!sub) return res.status(404).json({ error: "Not found" });

  res.json(broadcast);
});

// PATCH (broadcaster-only, global edit authority)
router.patch("/:id", requireAuth, requireBroadcaster, async (req, res) => {
  try {
    const { content } = req.body;

    const updated = await Broadcast.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    req.app
      .get("io")
      .to(`channel:${updated.channelId}`)
      .emit("broadcast:update", updated);

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (broadcaster-only)
router.delete("/:id", requireAuth, requireBroadcaster, async (req, res) => {
  const deleted = await Broadcast.findByIdAndDelete(req.params.id);

  if (!deleted) return res.status(404).json({ error: "Not found" });

  req.app
    .get("io")
    .to(`channel:${deleted.channelId}`)
    .emit("broadcast:delete", { id: deleted._id });

  res.json({ ok: true });
});

module.exports = router;
