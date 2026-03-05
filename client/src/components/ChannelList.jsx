import React from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function ChannelList({
  channels = [],
  onUnsubscribe,
  busyId = null,
}) {
  if (!channels.length) {
    return (
      <div className="text-slate-600 text-sm">
        No subscriptions yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {channels.map((c) => (
        <Card key={c._id || c.id}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium">{c.name}</div>
              {c.description ? (
                <div className="text-sm text-slate-600 mt-1">{c.description}</div>
              ) : (
                <div className="text-sm text-slate-500 mt-1">No description.</div>
              )}
              <div className="text-xs text-slate-400 mt-2">
                slug: {c.slug}
              </div>
            </div>

            <Button
              className="shrink-0"
              onClick={() => onUnsubscribe?.(c._id || c.id)}
              disabled={busyId === (c._id || c.id)}
            >
              {busyId === (c._id || c.id) ? "Working…" : "Unsubscribe"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}