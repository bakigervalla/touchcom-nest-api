import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import {
  CorsConfig,
  HiveMQConfig,
  NestConfig,
  SwaggerConfig,
} from '@common/configs/config.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Touchcom')
      .setDescription(swaggerConfig.description || 'Touchcom API')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    fs.writeJsonSync('./dist/swagger-spec.json', JSON.stringify(document));

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document, {
      swaggerOptions: {
        apisSorter: 'alpha',
        tagsSorter: 'alpha',
        operationsSorter: function (a, b) {
          const order = { get: '0', patch: '1', post: '2' };
          return order[a._root.entries[1][1]]?.localeCompare(
            order[b._root.entries[1][1]],
          );
        },
      },
    });
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  // MQTT
  const hiveMQConfig = configService.get<HiveMQConfig>('hiveMQ');
  const mqtt = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: `wss://${hiveMQConfig.host}:${hiveMQConfig.port}/mqtt`,
        host: hiveMQConfig.host,
        username: hiveMQConfig.username,
        password: hiveMQConfig.password,
        port: hiveMQConfig.port,
        protocol: 'wss',
        rejectUnauthorized: true,
      },
    },
  );
  mqtt.listen();

  // Firebase
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  await app.listen(process.env.PORT || nestConfig.port || 3000);
}

bootstrap();
