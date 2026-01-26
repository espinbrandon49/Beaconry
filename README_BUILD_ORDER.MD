# App Build Order — Beaconry Version 1

This build order is designed to ship quickly, avoid rewrites, and lock behavior early through explicit freeze points.

---

# Step 0 — Repo + Monolith Skeleton (FREEZE)

**Structure**
- `server/` — Node + Express
- `client/` — Vite + React
- Express serves the client build in production-mode simulation (`NODE_ENV=production`)

**Requirements**
- Health route: `GET /api/health`

**Gate (PASS)**
- Server boots locally and responds to `GET /api/health`
- Client boots locally (Vite dev server)
- Server serves the built client locally (production-mode simulation)


# Step 0.5 — Env + Config Baseline (FREEZE)

- `.env.example` added for server and client (no secrets)
- Client API base URL is env-driven
- Server config supports dev/prod toggles
- Cookie + CORS baseline established (future auth-ready)

**Gate (PASS)**
- App boots locally with env-driven config
- No hardcoded URLs in client or server


---

## Step 1 — Data Layer (MongoDB + Mongoose) (FREEZE)

**Models (exactly four)**
- User
- Channel
- Subscription
- Broadcast

**Indexes**
- Users: unique `email`
- Channels: unique `slug`
- Subscriptions: unique compound `(userId, channelId)`
- Broadcasts: `(channelId, createdAt DESC)`

**Added-on**
- All models use timestamps (createdAt, updatedAt)
- Unique indexes are enforced at the DB/index level (not just app logic)

**Gate**
- Connects to MongoDB Atlas
- CRUD works locally
- Indexes build cleanly without warnings

---

## Step 2 — Authentication (Session Cookies) (FREEZE)

**Endpoints**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Rules**
- Session cookie holds identity
- `isBroadcaster` is read ONLY from the DB User record
- No client-side role authority
- Server is the authority for broadcaster-only routes

**Gate**
- Login persists across refresh locally

---

## Step 3 — Channels + Subscriptions API (FREEZE)

**Channels**
- `GET /api/channels` — list all channels
- Channels are seeded/admin-created (Version 1 does not require create/edit channel endpoints)

**Subscriptions**
- `GET /api/subscriptions` — my subscribed channels
- `POST /api/subscriptions/:channelId` — subscribe
- `DELETE /api/subscriptions/:channelId` — unsubscribe

**Gate**
- User can manage subscriptions
- Returned subscription list is correct

---

## Step 4 — Broadcasts API (FREEZE)

**Edit/Delete Authority (Version 1)**  
Any authenticated broadcaster may edit or delete any broadcast.  
Subscribers cannot edit or delete.

This supports operational correction in time-sensitive environments.

**Endpoints**
- `GET /api/broadcasts` — subscription-scoped feed
- `POST /api/broadcasts` — broadcaster-only
- `PATCH /api/broadcasts/:id` — broadcaster-only
- `DELETE /api/broadcasts/:id` — broadcaster-only

**Rules**
- Subscribers see only broadcasts from subscribed channels
- Broadcasters can publish to any channel
- Edit/delete rule is fixed and enforced (author-only or broadcaster-only)

**Gate**
- Feed is correctly scoped
- Broadcast create/update/delete works as expected

---

## Step 5 — Real-Time Delivery (Socket.io) (FREEZE)

**Behavior**
- Socket connects after authentication
- Client joins subscription-scoped rooms (or server computes rooms)
- On broadcast create/update/delete, server emits to channel room

**Gate**
- One client publishes
- Other subscribed clients receive updates instantly without refresh

---

## Step 6 — UI Pass (React) (FREEZE)

**Pages**
- Login / Signup
- Channel directory with subscribe toggles
- Subscription-scoped feed
- Broadcaster compose panel (only if `isBroadcaster`)

**Requirements**
- Loading states
- Empty states
- Error states
- No blank screens

**Gate**
- Full demo flow works end-to-end

---

## Step 7 — Deployment Hardening (FREEZE)

**Environment Variables**
- `MONGODB_URI`
- `SESSION_SECRET`

**Checks**
- Secure production cookies
- Correct `sameSite` settings
- Client build served by Express
- Socket.io functions in production
- Confirm WebSocket transport works in production (no “polling-only surprise”)
- Confirm cookie/session identity is available in socket handshake

**Gate**
- Production behavior matches local development

---

## Portfolio Demo Flow

1. Sign up as a subscriber  
2. Subscribe to multiple channels  
3. Log in as a broadcaster  
4. Publish a broadcast to a channel  
5. Subscriber feed updates instantly  
6. Unsubscribe from a channel  
7. Future broadcasts from that channel no longer appear


**Core Philosophy (Locked)**
The system is designed for authoritative, real-time broadcasts delivered to subscribed audiences, prioritizing clarity, trust, and timeliness over engagement or discussion.

**Canonical Language (Locked)**

Beaconry is a real-time broadcast system purpose-built for school districts.

It enables trusted district and school staff to publish authoritative, one-way announcements to predefined channels, while district staff and approved community members (e.g., parents/students) receive only the updates they explicitly subscribe to.

Beaconry intentionally avoids public feeds and discussion features in favor of clarity, trust, and timely delivery.