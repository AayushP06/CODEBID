import { io } from "socket.io-client";

const WS_BASE = import.meta.env.VITE_WS_BASE || "http://localhost:4000";

export function createSocket() {
  const token = localStorage.getItem("token");
  return io(WS_BASE, {
    auth: { token },
    transports: ["websocket"],
  });
}
