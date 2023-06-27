import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//I am going to use repository pattern to take care of all entities

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn() //Primary Key  - Secondary keys: PrimaryColumn annotation
  id: number;

  @Column({ length: 100 })
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;
}
