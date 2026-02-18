# Beaconry

**Core Philosophy (Locked)**
The system is designed for authoritative, real-time broadcasts delivered to subscribed audiences, prioritizing clarity, trust, and timeliness over engagement or discussion.

**Canonical Language (Locked)**

Beaconry is a real-time broadcast system purpose-built for school districts.

It enables trusted district and school staff to publish authoritative, one-way announcements to predefined channels, while district staff and approved community members (e.g., parents/students) receive only the updates they explicitly subscribe to.

Beaconry intentionally avoids public feeds and discussion features in favor of clarity, trust, and timely delivery.

---

## What This Is

Beaconry is a **private, real-time broadcast system** for delivering important updates to a defined audience.

The system supports one-way communication from authorized users to subscribed recipients. Content is scoped, timely, and intentionally free of engagement mechanics such as comments, reactions, or public feeds.

This design favors **correctness and presence** over visibility or reach.

---

## Design Intent

The system is built around the following principles:

- **Authoritative by design**  
  Broadcasts originate from trusted users and are consumed as-is.

- **Subscription-based visibility**  
  Users receive updates only from channels they have explicitly subscribed to.

- **No discussion layer**  
  There are no replies, threads, or engagement metrics. Broadcasts stand alone.

- **Real-time delivery**  
  Updates propagate immediately to subscribed users without requiring refresh.

- **Calm systems over noisy platforms**  
  The goal is reliable communication, not interaction loops.

---

## Conceptual Domain Models (Locked)

### User
Represents an authenticated participant in the system.

- may subscribe to one or more channels
- receives real-time updates for subscribed channels
- may be additionally authorized to broadcast

---

### Channel
Represents an audience segment.  Channels are created administratively and are not user-generated in Version 1.

Examples:
- District
- School-specific
- Staff
- Substitute Pool
- Transportation

Channels define **who receives a broadcast**, not **who is allowed to publish**.

---

### Broadcast
A single authoritative message.

- created by an authorized broadcaster
- assigned to exactly one channel
- delivered only to users subscribed to that channel
- not open to replies or discussion

Edit/Delete Authority (Version 1): Any authenticated broadcaster may edit or delete any broadcast. Subscribers cannot edit or delete.

---

### Subscription
Defines visibility and delivery scope.

- user ↔ channel relationship
- one-directional
- fully reversible
- determines which broadcasts a user receives

Unsubscribing immediately removes future visibility.

> **Subscription = “I want to receive updates from this channel.”**

---

## Delivery Logic (Canonical)
My Feed =
broadcasts from channels I am subscribed to


There is no global or public feed.

---

## Version 1 Canon (Authoritative)

### User Capabilities

There is **one User model** with two capabilities.

#### Subscriber (default)
All users are subscribers.

Subscribers can:
- subscribe and unsubscribe to channels
- read broadcasts from subscribed channels

Subscribers cannot:
- create, edit, or delete broadcasts

---

#### Broadcaster (authorized capability)
Some users are additionally authorized as broadcasters.

Broadcasters can:
- do everything a subscriber can
- create, edit, and delete broadcasts
- publish broadcasts to **any channel**

Broadcaster authority is **global** in Version 1 and is not scoped per channel.

---

### Posting Authority (Version 1 Rule)

In Version 1:
- broadcasters are trusted operators
- broadcasters may publish to any channel
- responsibility for correct scoping lies with the broadcaster, not the system

Channels scope **audience**, not **authority**.

---

## Example Flow (Canonical)

### Scenario: School District Snow Day

**Context**
- Closed system (school district)
- Trusted broadcasters (superintendent, principals, secretaries)
- Channels already exist

---

### Step 1: Subscriptions
- Parents subscribe to: `District`, relevant school channel
- Staff subscribe to: `District`, `Staff`
- Substitutes subscribe to: `District`, `Substitute Pool`

---

### Step 2: Broadcast Creation
At 5:30 AM, the superintendent logs in and publishes:

- Message: “All schools are closed today due to inclement weather.”
- Channel: `District`

---

### Step 3: Delivery
- Broadcast is stored
- Real-time update is emitted
- All users subscribed to `District` receive the message immediately

Users not subscribed to `District` do not see the broadcast.

---

### Step 4: Follow-Up Broadcasts
Additional broadcasts may be issued to:
- `Staff` (internal instructions)
- `Transportation` (route cancellations)

Same rules apply.

---

### Step 5: Error Handling (Procedural)
If a broadcast is posted to the wrong channel:
- the broadcaster corrects or deletes it
- a corrected broadcast may be issued

This is handled procedurally, not via permission enforcement.

---

## Explicit Non-Goals (Version 1)

Version 1 intentionally excludes:
- channel-scoped posting permissions
- approval workflows
- moderation systems
- public or global feeds
- discussion threads or replies
- engagement metrics or reactions

---

## Version 1 Invariants

- visibility is always subscription-based
- broadcasts are never publicly discoverable
- subscriptions are one-directional and reversible
- unsubscribing immediately removes future delivery
- real-time delivery does not imply interaction
- engagement metrics are never stored
- authority is trusted, not algorithmic

---

## Tools (Locked)

**Frontend**
- React (Vite)
- Tailwind CSS

**Backend**
- Node.js
- Express
- REST API (server-defined routes and responses)

**Data**
- MongoDB
- Mongoose

**Auth**
- Session-based authentication (HTTP-only cookies)
- Server-managed sessions

**Real-Time**
- WebSockets (Socket.io) for live broadcast delivery only

**Deployment**
- Single-server web application (monolith)

---

## Canonical Database Schema (Version 1)

The following schema names are **authoritative** and must not be renamed without revising the Canon.

---

### User

Represents an authenticated participant in the system.

**Collection / collection:** `users`

**Fields (canonical)**
- `id`
- `email`
- `passwordHash`
- `isBroadcaster` *(boolean, Version 1 authority flag)*
- `createdAt`
- `updatedAt`

**Notes**
- All users are subscribers by default.
- `isBroadcaster` grants global posting authority in Version 1.
- No role collections exist in Version 1.

---

### Channel

Represents an audience segment.

**Collection / Collection:** `channels`

**Fields (canonical)**
- `id`
- `name`
- `slug`
- `description`
- `createdAt`
- `updatedAt`

**Notes**
- Channels define **audience**, not authority.
- Channels are assumed to be created administratively.
- No ownership or admin fields exist in Version 1.

---

### Subscription

Defines visibility between a user and a channel.

**Collection / :** `subscriptions`

**Fields (canonical)**
- `id`
- `userId` → references `users.id`
- `channelId` → references `channels.id`
- `createdAt`

**Constraints**
- `(userId, channelId)` must be unique

**Notes**
- Subscriptions are one-directional.
- Unsubscribing deletes the row.
- Subscriptions do **not** grant posting rights.

---

### Broadcast

Represents a single authoritative message.

**Collection / " ":** `broadcasts`

**Fields (canonical)**
- `id`
- `channelId` → references `channels.id`
- `authorId` → references `users.id`
- `content`
- `createdAt`
- `updatedAt`

**Notes**
- A broadcast belongs to **exactly one channel**.
- Only users with `isBroadcaster = true` may create, edit, or delete broadcasts.
- No replies, reactions, or engagement metadata exist.

---

## Canonical Relationships (Version 1)

User ── subscribes ──▶ Channel
User ── authors ──▶ Broadcast ── belongs to ──▶ Channel


There is **no** relationship between `User` and `Channel` for posting authority in Version 1.

---

## Explicitly Absent (Version 1)

The following collections / collections **do not exist** in Version 1:

- `channel_roles`
- `channel_memberships`
- `permissions`
- `roles`
- `comments`
- `reactions`
- `likes`
- `feeds`

These are **intentional omissions**, not missing features.

---

## Version 2 Compatibility Note

Version 2 may introduce a new collection:

- `channel_roles` *(user ↔ channel ↔ role)*

No existing schema names need to change to support this.

---

## Schema Lock Statement

> **The schema names `users`, `channels`, `subscriptions`, and `broadcasts` are canonical for Version 1 and must remain stable across implementation.**


## Status

This document represents a **Version 1 conceptual and technical freeze** for the So-Pals v2 revamp.

All implementation work must conform to the philosophy, domain model, canon, scope, and invariants defined above.

## Version 2 Preview (Non-Binding)

Version 2 may introduce channel-scoped posting authority, allowing broadcast permissions to be delegated per channel rather than globally. In this model, users remain subscribers by default, while posting rights are granted explicitly on a channel-by-channel basis (e.g., a principal may post to a school channel but not district-wide). This evolution preserves all Version 1 invariants—no public feeds, no discussion, no engagement mechanics—while refining authority boundaries for larger or more complex organizations. Version 2 is optional and contingent on demonstrated need after Version 1 stability.

Version 2 may introduce a new collection:

channel_roles (user ↔ channel ↔ role)

No existing schema names need to change to support this.