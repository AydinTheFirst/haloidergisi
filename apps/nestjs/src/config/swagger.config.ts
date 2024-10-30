import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import metadata from "@/metadata";

export const swagger = async (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  await SwaggerModule.loadPluginMetadata(metadata);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger", app, document);
};
