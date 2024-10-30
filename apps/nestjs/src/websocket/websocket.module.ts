import { Global, Module } from "@nestjs/common";

import { WebsocketGateway } from "./websocket.gateway";

@Global()
@Module({
  exports: [WebsocketGateway],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
