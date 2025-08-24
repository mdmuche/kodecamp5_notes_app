import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init } from './config/configuration';

async function bootstrap() {
  init();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(() => {});
