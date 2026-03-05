import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import * as channelApi from "../api/channel.api";
import * as subApi from "../api/subscription.api";

export default function Invite() {
  const { slug } = useParams();
  const nav = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const c = await channelApi.getChannelBySlug(slug);
        if (alive) setChannel(c);
      } catch (e) {
        if (alive) setErr(e?.message || "Invite not found");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [slug]);

  async function subscribe() {
    if (!channel?._id && !channel?.id) return;
    setSubmitting(true);
    setErr("");
    try {
      await subApi.subscribe(channel._id || channel.id);
      nav("/feed");
    } catch (e) {
      setErr(e?.message || "Subscribe failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="text-slate-600">Loading invite…</div>;

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <div className="text-lg font-semibold mb-1">Channel Invite</div>

        {err ? (
          <div className="text-red-600 text-sm">{err}</div>
        ) : channel ? (
          <>
            <div className="text-sm text-slate-600 mb-4">
              You’ve been invited to subscribe to:
            </div>

            <div className="font-medium">{channel.name}</div>
            <div className="text-sm text-slate-600 mt-1">
              {channel.description || "No description."}
            </div>
            <div className="text-xs text-slate-400 mt-2">slug: {channel.slug}</div>

            <div className="mt-5">
              <Button onClick={subscribe} disabled={submitting}>
                {submitting ? "Subscribing…" : "Subscribe"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-slate-600 text-sm">Invite not found.</div>
        )}
      </Card>
    </div>
  );
}