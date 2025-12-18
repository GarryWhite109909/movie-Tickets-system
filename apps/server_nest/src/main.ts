import 'reflect-metadata'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// Fix BigInt serialization globally
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Serve static files with specific prefix if needed, though ServeStaticModule in AppModule handles root
  // The frontend might expect /api/uploads or just /uploads depending on proxy
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3003;
  await app.listen(port);
  console.log(`Nest server listening on http://localhost:${port}`);
}
bootstrap();
