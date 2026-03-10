# Step 7 --- Real Deployment Verification (FREEZE)

This step validates Beaconry under **real runtime conditions** using a
**Heroku deployment running the full MERN monolith**.

The system is deployed as a **single Node/Express service** where:

-   Express serves the React production build
-   REST API and Socket.io run from the same server
-   MongoDB Atlas provides the database
-   The application is accessed through the Heroku HTTPS domain

The goal is to confirm that the system behaves correctly when run the
way users would actually experience it.

------------------------------------------------------------------------

# Deployment Architecture

    Browser
       │
    HTTPS
       │
    Heroku dyno
       ├ Express server
       ├ React production build (client/dist)
       ├ REST API (/api)
       └ Socket.io
       │
    MongoDB Atlas

All traffic flows through a single origin:

    https://<app-name>.herokuapp.com

------------------------------------------------------------------------

# Environment Variables (Heroku Config Vars)

The following environment variables must be configured on the Heroku
app:

-   `MONGODB_URI`
-   `SESSION_SECRET`
-   `NODE_ENV=production`
-   `CORS_ORIGIN=https://<app-name>.herokuapp.com`
-   `CORS_CREDENTIALS=true`

These ensure the application runs with the correct database connection,
session security, and origin policy.

------------------------------------------------------------------------

# Deployment Conditions

The following conditions must be satisfied before verification:

-   The repository is deployed to **Heroku as a Node service**
-   The React client build must exist at: client/dist
    This build is generated during deployment using the client build script.
    Express serves this directory in production.
-   Express serves the React build in production
-   The deployed application runs under the Heroku HTTPS domain
-   Frontend and backend operate from the **same origin**
-   Socket.io runs on the same server as the REST API
-   MongoDB Atlas is used as the production database
-   Production environment variables are configured on the Heroku app
-   Database is initialized with **demo seed data** representing a
    realistic district environment

------------------------------------------------------------------------

# Runtime Checks

Verify the following behavior in the deployed environment.

------------------------------------------------------------------------

## Health Check

Confirm the deployed service is reachable and running correctly.

    GET /api/health

Expected response:

    { status: "ok", env: "production" }

This confirms the server is running and responding in the production
environment.

------------------------------------------------------------------------

## Cookies & Sessions

Verify session security behavior:

-   Secure cookies enabled (`secure: true`)
-   `sameSite` operates correctly under HTTPS
-   Session cookie issued by Express
-   Session persists across browser refresh
-   Session store uses MongoDB Atlas
-   Session cookie appears in the browser devtools

------------------------------------------------------------------------

## Client Serving

Verify the client is served correctly:

-   React client served from `client/dist`
-   Visiting the root URL loads the application
-   Direct navigation to routes loads `index.html`
-   SPA routing works properly

------------------------------------------------------------------------

## Real-Time Delivery

Verify WebSocket behavior:

-   Socket.io connects successfully
-   Connection occurs over **WebSocket transport**
-   No unintended polling fallback
-   Session cookie is present during the Socket.io handshake
-   Socket joins correct subscription rooms

------------------------------------------------------------------------

## Authorization Integrity

Verify server-side authority enforcement:

-   User identity derived from session
-   Broadcaster permissions enforced server-side
-   Subscribers only receive broadcasts from subscribed channels
-   Unauthorized operations are rejected

------------------------------------------------------------------------

## Server Logs

Inspect Heroku logs to confirm correct runtime behavior.

Expected indicators:

-   successful MongoDB connection
-   socket connections being established
-   broadcast events being emitted
-   no unhandled server errors

Logs can be inspected using:

    heroku logs --tail

------------------------------------------------------------------------

# Gate (PASS CONDITIONS)

Step 7 passes when the deployed Heroku application behaves identically
to local development.

The following must be verified:

-   Application loads correctly from the Heroku HTTPS domain
-   Health endpoint confirms production runtime
-   Authentication persists across browser refresh
-   API routes operate normally
-   Real-time broadcasts deliver correctly to subscribed clients
-   Secure session cookies are issued and accepted by the browser
-   Socket.io connections authenticate using the session cookie
-   MongoDB Atlas successfully stores and retrieves application data
-   Server logs show normal operation with no critical runtime errors

When these conditions are met, Beaconry is confirmed to operate
correctly in a **real deployed environment**.
