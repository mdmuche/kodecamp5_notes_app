import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init } from './config/configuration';
import session from 'express-session';

async function bootstrap() {
  init();
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      name: 'en_session',
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE as string, 10),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(() => {});
