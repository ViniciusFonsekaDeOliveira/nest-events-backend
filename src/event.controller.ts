import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { CreateEventDto } from './create-event-dto';
import { UpdateEventDto } from './update-event-dto';
import { Event } from './event.entity';

@Controller('/event')
export class EventController {
  private events: Event[] = [];
  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    const event = this.events.find((event) => event.id === parseInt(id));
    return event;
  }

  @Post() //Create Payload
  create(@Body() input: CreateEventDto) {
    //as you dont know the type, you can create a class dto.
    //Para criar primeiro é necessário converter o payload para corresponder ao tipo de dado que queremos persistir no banco.
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };
    this.events.push(event);
    return event;
  }

  @Patch(':id') //Update Payload
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    //Para atualizar primeiro verifica-se se o elemento está lá. Antes de atualizar no bd, atualiza-se local.
    const index = this.events.findIndex((event) => event.id === parseInt(id));

    const updatedEvent = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    };

    this.events[index] = updatedEvent;

    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    //the best pratice is not return anything, exceto o código http 204.
    this.events = this.events.filter((event) => event.id !== parseInt(id));
  }
}
