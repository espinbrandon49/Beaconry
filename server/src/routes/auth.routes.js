const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      passwordHash
    });

    req.session.userId = user._id;

    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      isBroadcaster: user.isBroadcaster
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  req.session.userId = user._id;

  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    isBroadcaster: user.isBroadcaster
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// ME
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    isBroadcaster: user.isBroadcaster
  });
});

module.exports = router;