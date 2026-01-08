import "dotenv/config";
import http from "http";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";

const server = http.createServer(app);
initSocket(server);

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
