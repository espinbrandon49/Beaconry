const express = require("express");
const Subscription = require("../models/Subscription");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { channelId } = req.body;

    const created = await Subscription.create({
      userId: req.user._id,
      channelId
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  const subs = await Subscription.find({
    userId: req.user._id
  }).sort({ createdAt: -1 });

  res.json(subs);
});

router.get("/:id", async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).json({ error: "Not found" });
  res.json(sub);
});

router.delete("/:channelId", requireAuth, async (req, res) => {
  const deleted = await Subscription.findOneAndDelete({
    userId: req.user._id,
    channelId: req.params.channelId
  });

  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
