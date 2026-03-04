function requireBroadcaster(req, res, next) {
  if (!req.user?.isBroadcaster) {
    return res.status(403).json({ error: "Broadcaster only" });
  }

  next();
}

module.exports = requireBroadcaster;