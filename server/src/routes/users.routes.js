const express = require("express");
const User = require("../models/User");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const created = await User.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LIST
router.get("/", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// GET ONE
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
