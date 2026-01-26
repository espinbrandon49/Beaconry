const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

// CORS baseline (cookie-ready)
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const CREDENTIALS = String(process.env.CORS_CREDENTIALS || "true") === "true";

app.use(
  cors({
    origin: ORIGIN,
    credentials: CREDENTIALS,
  })
);

// REQUIRED: Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
  });
});

module.exports = app;
