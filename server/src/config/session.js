const session = require("express-session");
const MongoStore = require("connect-mongo").default;

function sessionConfig() {
  return session({
    name: "beaconry.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  });
}

module.exports = sessionConfig;