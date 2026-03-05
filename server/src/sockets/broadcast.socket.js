const Subscription = require("../models/Subscription");

function initBroadcastSockets(io) {
  io.on("connection", async (socket) => {
    const req = socket.request;

    // Session auth required
    if (!req.session?.userId) {
      socket.disconnect();
      return;
    }

    const userId = req.session.userId;

    // Derive rooms from DB subscriptions
    const subs = await Subscription.find({ userId }).select("channelId");

    const channelIds = subs.map((s) => s.channelId.toString());

    channelIds.forEach((channelId) => {
      socket.join(`channel:${channelId}`);
    });

    console.log(`[socket] user ${userId} joined`, channelIds);
  });
}

module.exports = initBroadcastSockets;