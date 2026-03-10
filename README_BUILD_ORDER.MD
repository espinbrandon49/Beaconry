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

### Channels
- `GET /api/channels/mine` — list my subscribed channels
- `GET /api/channels/:id` — get one channel (broadcaster OR subscribed user; stealth 404)
- Channels are seeded/admin-created (Version 1 does not require create/edit channel endpoints)

### Subscriptions
- `GET /api/subscriptions/mine` — my subscriptions
- `POST /api/subscriptions` — subscribe (body: `{ channelId }`)
- `DELETE /api/subscriptions/:channelId` — unsubscribe (self only)

### Gate
- User can subscribe/unsubscribe to a channel
- `/api/subscriptions/mine` reflects changes correctly
- `/api/channels/mine` matches the user’s subscriptions

---

## Step 4 — Broadcasts API (FREEZE)

**Edit/Delete Authority (Version 1)**  
Any authenticated broadcaster may edit or delete any broadcast.  
Subscribers cannot edit or delete.

This supports operational correction in time-sensitive environments.

**Endpoints**
- `GET /api/broadcasts/feed` — subscription-scoped feed
- `POST /api/broadcasts` — broadcaster-only
- `PATCH /api/broadcasts/:id` — broadcaster-only
- `DELETE /api/broadcasts/:id` — broadcaster-only

**Rules**
- Subscribers see only broadcasts from subscribed channels
- Broadcasters can publish to any channel
- Edit/delete authority is broadcaster-only (global), not author-scoped.

**Gate**
- Feed is correctly scoped
- Broadcast create/update/delete works as expected

---

## Step 5 — Real-Time Delivery (Socket.io) (FREEZE)

### Behavior
- Socket connection requires valid session authentication
- Server derives channel room membership from DB subscriptions (client does not declare rooms)
- Each channel maps to a channel room
- On broadcast create/update/delete, server emits to the appropriate channel room
- No global broadcast room exists

### Gate
- One broadcaster publishes/edits/deletes a broadcast
- Subscribed clients receive updates instantly without refresh
- Unsubscribed clients receive nothing

---

## Step 6 — UI Pass (React) (FREEZE)

### Styling Baseline
Before building pages:

- Install TailwindCSS
- Configure `index.css`
- Create UI primitives:
  - `Button`
  - `Card`
  - `Badge`
- Establish the app frame:
  - Header
  - Centered container (`max-w-*`)
  - Consistent spacing

These primitives must be used by all UI components.

---

### Pages
- Login / Signup
- Invite page (`/invite/:slug`) with subscribe action
- Subscription-scoped feed (merged broadcasts from subscribed channels)
- Broadcaster compose panel (visible only if `isBroadcaster = true`)

---

### Components
- `BroadcastItem`
- `ChannelList`
- `BroadcasterPanel`

Components must use the shared UI primitives.

---

### UI Requirements
- Loading states
- Empty states  
  - “No subscriptions yet”
  - “No broadcasts yet”
- Error states
- No blank screens
- No global channel browsing

---

### Styling Principles (Locked)

Beaconry should look like a **district information portal**, not a social network.

Design traits:

- calm
- clean
- authoritative
- readable
- distraction-free

Broadcast cards must show:

- channel
- timestamp
- content

No reactions, comments, or engagement features.

---

### Gate

- User can sign up and log in
- User can subscribe via invite link
- Feed reflects subscribed channels only
- Broadcaster can create/update/delete broadcasts
- Real-time updates function correctly
- Full demo flow works end-to-end
- Layout is readable on mobile and desktop

---

## Step 7 — Real Deployment Verification (FREEZE)

see separate deployment file

---

---

## Portfolio Demo Flow

1. Sign up as a subscriber  
2. Subscribe to multiple channels via invite links  
3. Log in as a broadcaster  
4. Publish a broadcast to a channel  
5. Subscriber feed updates instantly (real-time delivery)  
6. Unsubscribe from a channel  
7. Future broadcasts from that channel no longer appear in the feed


**Core Philosophy (Locked)**
The system is designed for authoritative, real-time broadcasts delivered to subscribed audiences, prioritizing clarity, trust, and timeliness over engagement or discussion.

**Canonical Language (Locked)**

Beaconry is a real-time broadcast system purpose-built for school districts.

It enables trusted district and school staff to publish authoritative, one-way announcements to predefined channels, while district staff and approved community members (e.g., parents/students) receive only the updates they explicitly subscribe to (via invite/onboarding).

Beaconry intentionally avoids public feeds and discussion features in favor of clarity, trust, and timely delivery.