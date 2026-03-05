import { apiFetch } from "./http";

export function getMyChannels() {
  return apiFetch("/api/channels/mine");
}

// Requires backend route: GET /api/channels/slug/:slug
export function getChannelBySlug(slug) {
  return apiFetch(`/api/channels/slug/${encodeURIComponent(slug)}`);
}

// Existing endpoint (auth + broadcaster OR subscribed)
export function getChannelById(id) {
  return apiFetch(`/api/channels/${id}`);
}