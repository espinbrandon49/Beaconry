import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function BroadcasterPanel({
  myChannels = [],
  onCreate,
}) {
  const [channelId, setChannelId] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // Convenience: if broadcaster is subscribed to at least one channel, default it.
  useEffect(() => {
    if (!channelId && myChannels.length) {
      setChannelId(myChannels[0]._id || myChannels[0].id);
    }
  }, [myChannels, channelId]);

  async function submit() {
    setErr("");
    setSubmitting(true);
    try {
      await onCreate?.({ channelId, content });
      setContent("");
    } catch (e) {
      setErr(e?.message || "Failed to publish");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mb-6">
      <div className="font-semibold mb-2">Publish Broadcast</div>
      <div className="text-sm text-slate-600 mb-4">
        Broadcasters may publish to any channel. If you aren’t subscribed to the target
        channel, paste its <span className="font-mono">channelId</span>.
      </div>

      <div className="space-y-3">
        {myChannels.length ? (
          <select
            className="w-full border border-slate-200 rounded-md p-2 text-sm bg-white"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            {myChannels.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="w-full border border-slate-200 rounded-md p-2 text-sm"
            placeholder="Paste channelId here (broadcaster-only use)"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
        )}

        <textarea
          className="w-full border border-slate-200 rounded-md p-3 text-sm"
          rows={4}
          placeholder="Write an authoritative broadcast…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {err ? <div className="text-sm text-red-600">{err}</div> : null}

        <div className="flex items-center gap-2">
          <Button
            onClick={submit}
            disabled={submitting || !channelId.trim() || !content.trim()}
          >
            {submitting ? "Publishing…" : "Publish"}
          </Button>
          <div className="text-xs text-slate-500">
            Max 1000 chars recommended.
          </div>
        </div>
      </div>
    </Card>
  );
}