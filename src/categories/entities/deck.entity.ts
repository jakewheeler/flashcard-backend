import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Card } from './card.entity';

@Entity()
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    type => Category,
    category => category.decks,
    { onDelete: 'CASCADE' },
  )
  category: Category;

  @OneToMany(
    type => Card,
    card => card.deck,
    { cascade: true },
  )
  cards: Card[];
}
