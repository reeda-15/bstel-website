import { createServer } from "node:http";
import { Server } from "socket.io";
import { AUCTION_EVENTS, auctionRoom } from "./events";

const port = Number(process.env.PORT || 4100);
const internalSecret = process.env.REALTIME_INTERNAL_SECRET || "dev-secret";

const httpServer = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === "POST" && request.url === "/internal/auction-price-changed") {
    if (request.headers["x-internal-secret"] !== internalSecret) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const payload = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    const auctionId = payload.auction_id || payload.auctionId;

    if (auctionId) {
      io.to(auctionRoom(auctionId)).emit(AUCTION_EVENTS.PRICE_CHANGED, payload);
    }

    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "not_found" }));
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.WEB_ORIGIN || "http://127.0.0.1:3100",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers.authorization;
  if (!token && process.env.REQUIRE_SOCKET_AUTH === "true") {
    next(new Error("auth_required"));
    return;
  }
  next();
});

io.on("connection", (socket) => {
  socket.on("auction:join", ({ auctionId }: { auctionId?: string }) => {
    if (!auctionId) return;
    socket.join(auctionRoom(auctionId));
    const room = io.sockets.adapter.rooms.get(auctionRoom(auctionId));
    io.to(auctionRoom(auctionId)).emit(AUCTION_EVENTS.VIEWERS_CHANGED, {
      auctionId,
      viewers: room?.size || 1,
      serverTime: new Date().toISOString(),
    });
  });

  socket.on("auction:leave", ({ auctionId }: { auctionId?: string }) => {
    if (!auctionId) return;
    socket.leave(auctionRoom(auctionId));
  });
});

httpServer.listen(port, "127.0.0.1", () => {
  console.log(`Paddle realtime service listening on http://127.0.0.1:${port}`);
});
