import {apiFetch} from "./http";

// GET FEED
export async function getFeed(since) {
  let url = "/api/broadcasts/feed";

  if (since) {
    url += `?since=${encodeURIComponent(since)}`;
  }

  return apiFetch(url);
}

// CREATE
export async function createBroadcast(data) {
  return apiFetch("/api/broadcasts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE
export async function updateBroadcast(id, data) {
  return apiFetch(`/api/broadcasts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// DELETE
export async function deleteBroadcast(id) {
  return apiFetch(`/api/broadcasts/${id}`, {
    method: "DELETE",
  });
}