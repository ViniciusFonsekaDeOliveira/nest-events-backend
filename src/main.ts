import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   logger: ['error', 'warn', 'debug'], //Priva o console da verbosidade dos logs em verde
  // });

  const app = await NestFactory.create(AppModule);
  //To use Pipes Validators globally
  // Once its enabled globally we can safely remove it from the params of the route controller methods.
  app.useGlobalPipes(new ValidationPipe()); //set off to use groups validation
  await app.listen(3000);
}
bootstrap();
