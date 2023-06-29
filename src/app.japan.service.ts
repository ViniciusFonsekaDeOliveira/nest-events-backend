import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  constructor(
    @Inject('APP_NAME') //Injeta APP_NAME nesta classe, pra isso funcionar essa classe precisa ser Injectable.
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {}
  getHello(): string {
    console.log(process.env.DB_HOST);
    return `こんにちは世界 from ${this.name}, ${this.message}`;
  }
}
