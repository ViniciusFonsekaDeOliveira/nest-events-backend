import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    //npm i --save @nestjs/config - Twelve-Factor App - Arquivos de configuração para usar o .env
    ConfigModule.forRoot(), //Sem essa linha, o Nest não consegue ler o arquivo .env na raiz desta aplicação.
    /** Deve-se colocar um .env file em cada ambiente (dev, test, staging, production) iniciando cada qual com suas respectivas variáveis de ambiente.
     * e então settar TypeORM com essas variáveis de ambiente.
     */
    //Dynamic Module
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

    EventsModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
  // Providers podem ser escritos de maneira mais detalhada, especificando qual uma classe que também compartilha os mesmos métodos que AppService
  // Class Provider
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService,
    },
    //Existem casos em que é preciso injetar crendenciais em uma classe - Value Provider.
    {
      provide: 'APP_NAME', //funciona como se fosse uma variável
      useValue: 'Nest Events Backend!', //Funciona como se fosse o valor da variavel
    },
    //Factory Provider - uma função que deve retornar um provider específico
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()} -- its a factory provider!`,
    },
    AppDummy,
  ],
})
export class AppModule {}
