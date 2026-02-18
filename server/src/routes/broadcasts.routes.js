const express = require("express");
const Broadcast = require("../models/Broadcast");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const created = await Broadcast.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LIST (optional filter by channelId)
router.get("/", async (req, res) => {
  const { channelId } = req.query;

  const filter = {};
  if (channelId) filter.channelId = channelId;

  const broadcasts = await Broadcast.find(filter).sort({ createdAt: -1 });
  res.json(broadcasts);
});

// GET ONE
router.get("/:id", async (req, res) => {
  const broadcast = await Broadcast.findById(req.params.id);
  if (!broadcast) return res.status(404).json({ error: "Not found" });
  res.json(broadcast);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const deleted = await Broadcast.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
