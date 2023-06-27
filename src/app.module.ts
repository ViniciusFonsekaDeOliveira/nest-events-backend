import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      username: 'root',
      password: 'example',
      database: 'nest-events',
      //Para mapear as entidades, deve-se avisar pra raiz quais entidades serão mapeadas
      entities: [Event],
      synchronize: true, //e claro, sincronizar o código com as tabelas do banco.
    }),
    /* O comando abaixo irá fazer um repositorio para uma entidade específica e disponível, 
    permitindo que ela seja injetada pelo NestJS neste módulo atual.
    É preciso fazer isso sempre, pra toda entidade e todo módulo 
    que precisar injetar essa entidade (repositorio)
    */
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [AppController, EventController],
  providers: [AppService],
})
export class AppModule {}
