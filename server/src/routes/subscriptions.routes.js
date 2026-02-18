const express = require("express");
const Subscription = require("../models/Subscription");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const created = await Subscription.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  const subs = await Subscription.find().sort({ createdAt: -1 });
  res.json(subs);
});

router.get("/:id", async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).json({ error: "Not found" });
  res.json(sub);
});

router.delete("/:id", async (req, res) => {
  const deleted = await Subscription.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
