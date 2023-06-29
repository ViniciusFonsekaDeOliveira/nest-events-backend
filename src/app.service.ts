import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('APP_NAME') //Injeta APP_NAME nesta classe, e ela pode ser usada por meio da variável name.
    private readonly name: string,
  ) {}

  getHello(): string {
    return `Hello World! from ${this.name}`;
  }

  getBye(): string {
    return 'Bye!';
  }
}
