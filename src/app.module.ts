import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    //npm i --save @nestjs/config - Twelve-Factor App - Arquivos de configuração para usar o .env
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
      load: [ormConfig],
      expandVariables: true, //permite que seu .env atribua variaveis em si mesmo.
    }), //Sem essa linha, o Nest não consegue ler o arquivo .env na raiz desta aplicação.
    /** Deve-se colocar um .env file em cada ambiente (dev, test, staging, production) iniciando cada qual com suas respectivas variáveis de ambiente.
     * e então settar TypeORM com essas variáveis de ambiente.
     */
    // //Dynamic Module - Plain Configuration Of TypeORM.
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: Number(process.env.DB_PORT), //Tenha certeza de que está convertendo para number
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   //Para mapear as entidades, deve-se avisar pra raiz quais entidades serão mapeadas
    //   entities: [Event],
    //   synchronize: true, //e claro, sincronizar o código com as tabelas do banco.
    // }),
    // /* O comando abaixo irá fazer um repositorio para uma entidade específica e disponível,
    // permitindo que ela seja injetada pelo NestJS neste módulo atual.
    // É preciso fazer isso sempre, pra toda entidade e todo módulo
    // que precisar injetar essa entidade (repositorio)
    // */

    //Uma vez criado o arquivo contendo a função que exportará as configurações do TypeORM
    //e solicitado ao configModule.forRoot para loadar ele é preciso registrá-lo desse novo jeito
    TypeOrmModule.forRootAsync({
      //Permite configurar um modulo de forma assincrona. E escolher a configuração correta a ser passada para o módulo principal do Nest de acordo
      //com o ambiente da aplicação.
      //useFactory: ormConfig,
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),

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
