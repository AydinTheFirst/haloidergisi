import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  index() {
    return {
      code: 200,
      message: "Hello World!",
    };
  }
}
