const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRoutes = require("./routes/users.routes");
const channelsRoutes = require("./routes/channels.routes");
const subscriptionsRoutes = require("./routes/subscriptions.routes");
const broadcastsRoutes = require("./routes/broadcasts.routes");

const app = express();

app.use(express.json());

// CORS baseline (cookie-ready)
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const CREDENTIALS = String(process.env.CORS_CREDENTIALS || "true") === "true";

app.use(
  cors({
    origin: ORIGIN,
    credentials: CREDENTIALS
  })
);

// REQUIRED: Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development"
  });
});

// Step 1 CRUD routes (dev-grade)
app.use("/api/users", usersRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/broadcasts", broadcastsRoutes);

// Basic error handler (keeps dev debugging sane)
app.use((err, _req, res, _next) => {
  console.error("[app] unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
