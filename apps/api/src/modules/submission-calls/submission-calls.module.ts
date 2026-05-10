import { Module } from "@nestjs/common";

import { SubmissionCallsController } from "./submission-calls.controller";
import { SubmissionCallsService } from "./submission-calls.service";

@Module({
  controllers: [SubmissionCallsController],
  providers: [SubmissionCallsService],
  exports: [SubmissionCallsService],
})
export class SubmissionCallsModule {}
