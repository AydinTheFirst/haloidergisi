import { Global, Module } from "@nestjs/common";

import { NetgsmService } from "./netgsm.service";

@Global()
@Module({
  exports: [NetgsmService],
  providers: [NetgsmService],
})
export class NetgsmModule {}
