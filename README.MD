# Beaconry

Beaconry is a **real-time broadcast platform** designed for organizations that need to deliver **authoritative, one-way announcements** to subscribed audiences.

Unlike social feeds or messaging systems, Beaconry prioritizes **clarity, trust, and timeliness**. Broadcasters publish updates to channels, and subscribers receive those updates instantly in a subscription-scoped feed.

This project demonstrates a **full-stack real-time architecture** using React, Node.js, MongoDB, and Socket.io.

---

# Demo

[Beaconry Video Demo](https://youtu.be/Wv-V31TA8ZM)

```
Live App: https://beaconry-5423965f3fe8.herokuapp.com/feed
```

---

# Key Features

### Authentication
- Account signup/login
- Secure session-based authentication
- MongoDB-backed session storage

### Channels
- Channels represent broadcast streams
- Users subscribe/unsubscribe to channels
- Channel slugs support invite-style URLs

### Subscription-Scoped Feed
Users only see broadcasts from channels they follow.

```
GET /api/broadcasts/feed
```

Optional incremental sync:

```
GET /api/broadcasts/feed?since=<timestamp>
```

### Broadcaster Publishing
Authorized broadcasters can:

- Create broadcasts
- Edit broadcasts
- Delete broadcasts

Broadcast updates push instantly to subscribers.

### Real-Time Delivery
Socket.io delivers broadcasts in real time.

When a user connects:

1. Session is validated
2. Subscribed channels are loaded
3. Socket joins channel rooms
4. Broadcasts emit instantly to subscribers

---

# Tech Stack

### Frontend
- React
- Vite
- Context API
- Socket.io Client

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io

### Auth & Sessions
- express-session
- connect-mongo
- bcrypt

---

# Architecture

Beaconry uses a **monolith repo with a split client/server architecture**.

```
beaconry/
├─ server/
│  ├─ Express API
│  ├─ MongoDB models
│  ├─ Socket.io real-time layer
│
├─ client/
│  ├─ React application
│  ├─ API layer
│  ├─ Socket client
```

The Express server serves the React build in production. :contentReference[oaicite:0]{index=0}

---

# Core Data Models

### User
```
email
name
isBroadcaster
passwordHash
```

### Channel
```
name
slug
description
```

### Subscription
```
userId
channelId
```

### Broadcast
```
channelId
authorId
content
createdAt
```

Broadcasts are indexed for fast timeline queries. :contentReference[oaicite:1]{index=1}

---

# API Overview

### Auth
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Channels
```
GET /api/channels/mine
GET /api/channels/:id
GET /api/channels/slug/:slug
```

### Subscriptions
```
POST   /api/subscriptions
GET    /api/subscriptions/mine
DELETE /api/subscriptions/:channelId
```

### Broadcasts
```
GET    /api/broadcasts/feed
POST   /api/broadcasts
PATCH  /api/broadcasts/:id
DELETE /api/broadcasts/:id
```

---

# Local Development

Install dependencies

```
cd server
npm install

cd ../client
npm install
```

Run backend

```
npm run dev
```

Run frontend

```
npm run dev
```

---

# Environment Variables

Example `.env`

```
NODE_ENV=development
PORT=3001

CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

MONGODB_URI=<mongodb uri>
SESSION_SECRET=<secret>
```

---

# Why This Project Exists

Beaconry was built to explore a **real-time, subscription-based broadcast architecture** that avoids the complexity of social platforms.

It demonstrates:

- Real-time WebSocket delivery
- Secure session authentication
- Role-based publishing authority
- Subscription-scoped data access
- Clean React + Express separation

---

# Author

**Brandon Espinosa**

Full-stack developer portfolio project.