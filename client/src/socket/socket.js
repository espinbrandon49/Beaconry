import { io } from "socket.io-client";

const API_BASE =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:3001";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(API_BASE, {
      withCredentials: true,
      transports: ["websocket"], // prefer websocket;
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}