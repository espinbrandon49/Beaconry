require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../src/models/User");
const Channel = require("../src/models/Channel");
const Subscription = require("../src/models/Subscription");
const Broadcast = require("../src/models/Broadcast");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connected to MongoDB");

  const passwordHash = await bcrypt.hash("demo123", 10);

  const broadcaster = await User.findOneAndUpdate(
    { email: "demo-broadcaster@beaconry.app" },
    {
      email: "demo-broadcaster@beaconry.app",
      name: "Demo Broadcaster",
      passwordHash,
      isBroadcaster: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const subscriber = await User.findOneAndUpdate(
    { email: "demo-subscriber@beaconry.app" },
    {
      email: "demo-subscriber@beaconry.app",
      name: "Demo Subscriber",
      passwordHash,
      isBroadcaster: false,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log("Users seeded");

  const district = await Channel.findOneAndUpdate(
    { slug: "district-alerts" },
    {
      name: "District Alerts",
      slug: "district-alerts",
      description: "District-wide announcements",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const transportation = await Channel.findOneAndUpdate(
    { slug: "transportation" },
    {
      name: "Transportation",
      slug: "transportation",
      description: "Bus and route updates",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const athletics = await Channel.findOneAndUpdate(
    { slug: "athletics" },
    {
      name: "Athletics",
      slug: "athletics",
      description: "Sports announcements",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log("Channels seeded");

  await Subscription.deleteMany({});

  await Subscription.insertMany([
    { userId: broadcaster._id, channelId: district._id },
    { userId: broadcaster._id, channelId: transportation._id },
    { userId: broadcaster._id, channelId: athletics._id },

    { userId: subscriber._id, channelId: district._id },
    { userId: subscriber._id, channelId: transportation._id },
    { userId: subscriber._id, channelId: athletics._id },
  ]);

  console.log("Subscriptions seeded");

  const existing = await Broadcast.countDocuments();

  if (existing === 0) {
    await Broadcast.insertMany([
      {
        channelId: district._id,
        authorId: broadcaster._id,
        content:
          "District-wide network maintenance tonight from 10:00–11:30 PM. Systems may briefly go offline during this window.",
      },
      {
        channelId: transportation._id,
        authorId: broadcaster._id,
        content:
          "Bus Route 14 will run approximately 15 minutes late this morning due to traffic conditions near Maple Ave.",
      },
      {
        channelId: athletics._id,
        authorId: broadcaster._id,
        content:
          "Tonight’s varsity basketball game begins at 7:00 PM in the main gym. Students and families are welcome to attend.",
      },
      {
        channelId: district._id,
        authorId: broadcaster._id,
        content:
          "Reminder: early dismissal tomorrow at 1:30 PM for staff development.",
      },
    ]);

    console.log("Broadcasts seeded");
  } else {
    console.log("Broadcasts already exist — skipping");
  }

  console.log("Demo seed complete");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});