### Project Structure

## This is a monolith repo:

- One repo

- One server

- One client

- Express serves the React build in production

### Root

beaconry/
├─ server/   # Node + Express + MongoDB + Socket.io
├─ client/   # Vite + React
├─ .gitignore
├─ README.md

### server/ (Node + Express)

Purpose:
Auth, authority, data, real-time delivery

server/
├─ src/
│  ├─ server.js              # App entry (Express + HTTP server)
│  ├─ app.js                # Express app config
│  │
│  ├─ config/
│  │  ├─ db.js              # MongoDB connection (Mongoose)
│  │  └─ session.js         # Session + cookie config
│  │
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Channel.js
│  │  ├─ Subscription.js
│  │  └─ Broadcast.js
│  │
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  ├─ channel.routes.js
│  │  ├─ subscription.routes.js
│  │  └─ broadcast.routes.js
│  │
│  ├─ sockets/
│  │  └─ broadcast.socket.js
│  │
│  ├─ middleware/
│  │  ├─ requireAuth.js
│  │  └─ requireBroadcaster.js
│  │
│  └─ utils/
│     └─ asyncHandler.js
│
├─ package.json
└─ Procfile

Notes (important but short)

No services layer (not needed for v1)

No controllers folder (routes are thin)

Sockets isolated from HTTP

index.js creates server + socket

app.js configures Express only

### client/ (Vite + React)

Purpose:
Subscription-scoped consumption + broadcaster publishing.

client/
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  │
│  ├─ api/
│  │  ├─ auth.api.js
│  │  ├─ channel.api.js
│  │  ├─ subscription.api.js
│  │  └─ broadcast.api.js
│  │
│  ├─ socket/
│  │  └─ socket.js
│  │
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Signup.jsx
│  │  ├─ Feed.jsx
│  │  └─ Channels.jsx
│  │
│  ├─ components/
│  │  ├─ BroadcasterPanel.jsx
│  │  ├─ ChannelList.jsx
│  │  └─ BroadcastItem.jsx
│  │
│  ├─ context/
│  │  └─ AuthContext.jsx
│  │
│  └─ styles/
│     └─ index.css
│
├─ index.html
├─ vite.config.js
└─ package.json

Notes

One socket entry point

One API layer (no scattered fetch calls)

No state libraries needed (Context is enough)

Pages are route-level only

Components stay dumb

.gitignore (root)
node_modules
.env
dist
client/dist
