import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'Name should be at least 5 characters long!' }) // Pipe annotation with (min, max) caracteres to validade name attribute
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  when: string;
  // @Length(5, 255, { groups: ['create'] }) //In order to use groups of validation its necessary set the globalPipes off
  // @Length(10, 20, { groups: ['update'] }) //And update the route params with the specific group
  @Length(5, 255)
  address: string;
}
