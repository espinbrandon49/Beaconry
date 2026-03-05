import React, { useEffect, useState } from "react";
import * as channelApi from "../api/channel.api";
import * as subApi from "../api/subscription.api";
import ChannelList from "../components/ChannelList";

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const list = await channelApi.getMyChannels();
      setChannels(list || []);
    } catch (e) {
      setErr(e?.message || "Failed to load channels");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUnsubscribe(channelId) {
    setBusyId(channelId);
    setErr("");
    try {
      await subApi.unsubscribe(channelId);
      await load();
    } catch (e) {
      setErr(e?.message || "Unsubscribe failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="text-xl font-semibold mb-2">Channels</div>
      <div className="text-sm text-slate-600 mb-4">
        Your subscriptions. There is no global channel browsing.
      </div>

      {loading ? <div className="text-slate-600">Loading…</div> : null}
      {err ? <div className="text-sm text-red-600 mb-3">{err}</div> : null}

      {!loading ? (
        <ChannelList channels={channels} onUnsubscribe={onUnsubscribe} busyId={busyId} />
      ) : null}
    </div>
  );
}