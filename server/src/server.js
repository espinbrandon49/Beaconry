const path = require("path");
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Production-mode simulation: Express serves built client
if (NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

  app.use(express.static(clientDistPath));

  // SPA fallback (must be AFTER static)
  app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const server = http.createServer(app);

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
