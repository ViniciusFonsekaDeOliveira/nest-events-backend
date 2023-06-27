import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './create-event-dto';
import { UpdateEventDto } from './update-event-dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';

@Controller('/event')
export class EventController {
  // private events: Event[] = [];
  /** Repositórios possuem 4 métodos principais: find, finOne, save, remove */
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    //return this.events;
    return await this.repository.find();
  }

  // Just playing a little with TypeORM...
  @Get('/practice') //A ordem dos metodos no controller importa. Esse dá match com o de baixo. (:id)
  async practice() {
    return this.repository.find({
      select: ['id', 'when'],
      //Objetos juntos, usa a clausula where com &&, para usar o OR usar []
      where: [
        {
          id: MoreThan(3), //&& SELECT * FROM event WHERE (id > 3 && when > '2021-02-12T13:00:00') OR (description like '%meet%') LIMIT 2
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2, // take equivale a LIMIT --- skip equivale a OFFSET
      order: {
        id: 'DESC',
      },
    });
  }

  // Exploring Pipes Nest Concept in here. As we pass a ParseIntPipe, we can safely add a type for id.
  // Pipes helps validade all the input coming in our application
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // const event = this.events.find((event) => event.id === parseInt(id));
    // return event;
    console.log(typeof id);
    return await this.repository.findOne({ where: { id: id } });
  }

  @Post() //Create Payload
  async create(@Body() input: CreateEventDto) {
    //as you dont know the type, you can create a class dto.
    //Para criar primeiro é necessário converter o payload para corresponder ao tipo de dado que queremos persistir no banco.
    // const event = {
    //   ...input,
    //   when: new Date(input.when),
    //   id: this.events.length + 1,
    // };
    // this.events.push(event);
    // return event;
    /** Para novas entidades save vai criar novas tabelas. Para as mesmas entidades ele vai atualizá-las com os valores correntes. */
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
      // id: this.events.length + 1, Não é mais necessário pois implementamos que ele seja gerado automático com o annotation da Entity em envent.entity.
    });
  }

  @Patch(':id') //Update Payload
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    //Para atualizar primeiro verifica-se se o elemento está lá. Antes de atualizar no bd, atualiza-se local.
    //Fetch the entity first
    const event = await this.repository.findOne({ where: { id: id } });
    /** AO usar groups, de modo a manter errada a chamada de findOne, as falhas do teste de integração no postman ocorrem como erro 500
     * acusando when de ser nulo. Isso leva a questionar o validador, porém o questionamento real da nulidade do when se dá por que
     * event não é recuperado corretamente. Isso afetou outras partes do código, causando confusão na saída dos testes e na depuração.
     */

    const updatedEvent = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    // this.events[index] = updatedEvent;
    // return this.events[index];
    return await this.repository.save(updatedEvent);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    //the best pratice is not return anything, exceto o código http 204.
    //this.events = this.events.filter((event) => event.id !== parseInt(id));
    //Fetch the entity first
    const event = await this.repository.findOne({ where: { id: id } });
    await this.repository.remove(event);
  }
}
