import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Deck } from './deck.entity';

@Entity()
@Unique(['name'])
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    type => Deck,
    deck => deck.category,
    { eager: false },
  )
  decks: Deck[];
}
