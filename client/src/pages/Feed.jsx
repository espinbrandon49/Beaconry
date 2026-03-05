import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import * as broadcastApi from "../api/broadcast.api";
import * as channelApi from "../api/channel.api";
import { getSocket } from "../socket/socket";

import BroadcasterPanel from "../components/BroadcasterPanel";
import BroadcastItem from "../components/BroadcastItem";

function getId(x) {
  return (x?._id || x?.id || "").toString();
}

function getCreatedAt(x) {
  return x?.createdAt || "";
}

export default function Feed() {
  const { user } = useAuth();

  const [myChannels, setMyChannels] = useState([]);
  const [channelNameById, setChannelNameById] = useState({});

  const [broadcasts, setBroadcasts] = useState([]);
  const [lastSeen, setLastSeen] = useState(null);
  const lastSeenRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const isBroadcaster = !!user?.isBroadcaster;

  const channelMap = useMemo(() => channelNameById, [channelNameById]);

  function setLastSeenSafe(ts) {
    if (!ts) return;
    // Keep newest
    if (!lastSeenRef.current || ts > lastSeenRef.current) {
      lastSeenRef.current = ts;
      setLastSeen(ts);
    }
  }

  function mergeBroadcasts(incoming) {
    const list = Array.isArray(incoming) ? incoming : [incoming];

    setBroadcasts((prev) => {
      const map = new Map();

      // Incoming first so newest updates win if same id appears
      for (const b of list) {
        const id = getId(b);
        if (id) map.set(id, b);
      }
      for (const b of prev) {
        const id = getId(b);
        if (id && !map.has(id)) map.set(id, b);
      }

      const merged = Array.from(map.values());

      merged.sort((a, b) => {
        const ta = getCreatedAt(a);
        const tb = getCreatedAt(b);
        // ISO timestamps compare lexicographically
        if (ta < tb) return 1;
        if (ta > tb) return -1;
        return 0;
      });

      return merged.slice(0, 200);
    });

    // Update lastSeen based on newest incoming (feed is newest-first, but socket single events are just one)
    const newest = list
      .map((b) => getCreatedAt(b))
      .filter(Boolean)
      .sort()
      .slice(-1)[0];

    if (newest) setLastSeenSafe(newest);
  }

  async function loadInitial() {
    setLoading(true);
    setErr("");

    try {
      const [channels, feed] = await Promise.all([
        channelApi.getMyChannels(),
        broadcastApi.getFeed(null),
      ]);

      const list = channels || [];
      setMyChannels(list);

      const map = {};
      list.forEach((c) => {
        map[getId(c)] = c.name;
      });
      setChannelNameById(map);

      const feedList = feed || [];
      setBroadcasts(feedList);

      if (feedList.length > 0) {
        setLastSeenSafe(feedList[0].createdAt);
      }
    } catch (e) {
      setErr(e?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  // Real-time listeners (registered once)
  useEffect(() => {
    const s = getSocket();

    function onCreate(b) {
      mergeBroadcasts(b);
    }

    function onUpdate(b) {
      // Upsert updated broadcast into list
      mergeBroadcasts(b);
    }

    function onDelete(payload) {
      const id = (payload?.id || payload?._id)?.toString();
      if (!id) return;

      setBroadcasts((prev) => prev.filter((x) => getId(x) !== id));
    }

    // Optional durable recovery: on (re)connect, pull missed broadcasts since lastSeen
    async function onConnect() {
      const since = lastSeenRef.current;
      if (!since) return;

      try {
        const missed = await broadcastApi.getFeed(since);
        if (missed && missed.length) {
          mergeBroadcasts(missed);
        }
      } catch {
        // silent; sockets will still work
      }
    }

    s.on("broadcast:create", onCreate);
    s.on("broadcast:update", onUpdate);
    s.on("broadcast:delete", onDelete);
    s.on("connect", onConnect);

    return () => {
      s.off("broadcast:create", onCreate);
      s.off("broadcast:update", onUpdate);
      s.off("broadcast:delete", onDelete);
      s.off("connect", onConnect);
    };
    // IMPORTANT: no lastSeen dependency — listeners stay stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate({ channelId, content }) {
    await broadcastApi.createBroadcast({ channelId, content });
    // socket will insert (and merge) exactly once
  }

  async function onUpdate(id, content) {
    const updated = await broadcastApi.updateBroadcast(id, { content });
    mergeBroadcasts(updated);
  }

  async function onDelete(id) {
    await broadcastApi.deleteBroadcast(id);
    setBroadcasts((prev) => prev.filter((b) => getId(b) !== id.toString()));
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold mb-2">Your Feed</div>
        <div className="text-sm text-slate-600">
          Broadcasts from channels you are subscribed to. No global feed.
        </div>
      </div>

      {isBroadcaster ? (
        <BroadcasterPanel myChannels={myChannels} onCreate={onCreate} />
      ) : null}

      {loading ? <div className="text-slate-600">Loading…</div> : null}
      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      {!loading && !err && broadcasts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-sm">No broadcasts yet</div>
          <div className="text-xs mt-1">
            Updates from your subscribed channels will appear here.
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {broadcasts.map((b) => {
          const channelId = (b.channelId || "").toString();
          const name =
            channelMap[channelId] || `Channel ${channelId.slice(-6) || ""}`;

          return (
            <BroadcastItem
              key={b._id || b.id}
              broadcast={b}
              channelName={name}
              isBroadcaster={isBroadcaster}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}