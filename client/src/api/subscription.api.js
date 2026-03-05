import { apiFetch } from "./http";

export function getMySubscriptions() {
  return apiFetch("/api/subscriptions/mine");
}

export function subscribe(channelId) {
  return apiFetch("/api/subscriptions", {
    method: "POST",
    body: JSON.stringify({ channelId }),
  });
}

export function unsubscribe(channelId) {
  return apiFetch(`/api/subscriptions/${channelId}`, { method: "DELETE" });
}