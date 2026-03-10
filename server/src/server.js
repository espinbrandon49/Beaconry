const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { connectDB } = require("./config/db");
const sessionConfig = require("./config/session");
const initBroadcastSockets = require("./sockets/broadcast.socket");

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Production-mode simulation: Express serves built client
if (NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

  app.use(require("express").static(clientDistPath));

  // SPA fallback (must be AFTER static)
  app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const server = http.createServer(app);

// Create Socket.io server
const SOCKET_ORIGIN = process.env.CORS_ORIGIN;

if (!SOCKET_ORIGIN) {
  throw new Error("CORS_ORIGIN must be set for Socket.io");
}

const io = new Server(server, {
  cors: {
    origin: SOCKET_ORIGIN,
    credentials: true
  }
});

// Share session middleware with sockets
const sessionMiddleware = sessionConfig();

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

// Make io accessible in routes
app.set("io", io);

// Initialize socket handlers
initBroadcastSockets(io);

async function start() {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(
        `[server] listening on http://localhost:${PORT} (env=${NODE_ENV})`
      );
    });
  } catch (err) {
    console.error("[server] failed to start:", err);
    process.exit(1);
  }
}

start();