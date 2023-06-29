import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from 'src/events/event.entity';

//A criação deste arquivo orm.config (que é uma Factory Function) permite exportar as configurações do TypeORM para diferentes ambientes.
// export default (): TypeOrmModuleOptions => ({
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT), //Tenha certeza de que está convertendo para number
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   //Para mapear as entidades, deve-se avisar pra raiz quais entidades serão mapeadas
//   entities: [Event], //Garantir que é a classe correta.
//   synchronize: true, //e claro, sincronizar o código com as tabelas do banco.
// });

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), //Tenha certeza de que está convertendo para number
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //Para mapear as entidades, deve-se avisar pra raiz quais entidades serão mapeadas
    entities: [Event], //Garantir que é a classe correta.
    synchronize: false, //TENHA CERTEZA DE QUE ISSO ESTÁ DESABILITADO NO AMBIENTE DE PRODUÇÃO!!!!! Não pode ser true
  }),
);
