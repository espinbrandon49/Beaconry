const express = require("express");
const Channel = require("../models/Channel");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const created = await Channel.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  const channels = await Channel.find().sort({ createdAt: -1 });
  res.json(channels);
});

router.get("/:id", async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).json({ error: "Not found" });
  res.json(channel);
});

router.delete("/:id", async (req, res) => {
  const deleted = await Channel.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
