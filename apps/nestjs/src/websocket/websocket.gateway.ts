import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["websocket"],
})
export class WebsocketGateway implements OnModuleInit {
  private connectedSockets = new Map<string, any>();

  @WebSocketServer()
  io: Server;

  onModuleInit() {
    this.io.on("connection", (socket) => {
      Logger.debug(`Client connected: ${socket.id}`, "WebsocketGateway");
      this.connectedSockets.set(socket.id, socket);

      socket.on("disconnect", () => {
        this.connectedSockets.delete(socket.id);
        Logger.debug(`Client disconnected: ${socket.id}`, "WebsocketGateway");
      });
    });
  }
}
