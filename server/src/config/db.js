const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("[db] Missing MONGODB_URI in environment");
  }

  // Keeps queries predictable across mongoose versions
  mongoose.set("strictQuery", true);

  // Optional but helpful in dev
  mongoose.connection.on("connected", () => console.log("[db] connected"));
  mongoose.connection.on("error", (err) => console.error("[db] error", err));

  await mongoose.connect(uri, {
    autoIndex: true // ensures indexes build in dev (Gate requirement)
  });

  return mongoose.connection;
}

module.exports = { connectDB };
