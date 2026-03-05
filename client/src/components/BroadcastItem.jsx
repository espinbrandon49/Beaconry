import React, { useMemo, useState } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

export default function BroadcastItem({
  broadcast,
  channelName = "Channel",
  isBroadcaster = false,
  onUpdate,
  onDelete,
}) {
  const createdAt = useMemo(() => {
    const d = new Date(broadcast.createdAt);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
  }, [broadcast.createdAt]);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(broadcast.content || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    setSaving(true);
    try {
      await onUpdate?.(broadcast._id || broadcast.id, draft);
      setEditing(false);
    } catch (e) {
      setErr(e?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this broadcast?")) return;
    setErr("");
    try {
      await onDelete?.(broadcast._id || broadcast.id);
    } catch (e) {
      setErr(e?.message || "Failed to delete");
    }
  }

  return (
    <Card className="space-y-3 border-l-4 border-slate-300 pl-4 animate-[fadeIn_.25s_ease]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <Badge>{channelName}</Badge>
            <span className="text-xs text-slate-500 shrink-0">{createdAt}</span>
          </div>

          {!editing ? (
            <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap break-words">
              {broadcast.content}
            </p>
          ) : (
            <div className="space-y-2">
              <textarea
                className="w-full border border-slate-200 rounded-md p-3 text-sm"
                rows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              {err ? <div className="text-sm text-red-600">{err}</div> : null}
              <div className="flex gap-2">
                <Button onClick={save} disabled={saving || !draft.trim()}>
                  {saving ? "Saving…" : "Save"}
                </Button>
                <button
                  className="px-4 py-2 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                  onClick={() => {
                    setDraft(broadcast.content || "");
                    setEditing(false);
                    setErr("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {isBroadcaster && !editing ? (
          <div className="flex flex-col gap-2 shrink-0">
            <button
              className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-md border border-red-200 bg-white text-red-700 hover:bg-red-50"
              onClick={remove}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}