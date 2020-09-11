import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Category } from './category.entity';
import { Card } from './card.entity';

@Entity()
@Unique(['name', 'categoryId'])
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    () => Category,
    category => category.decks,
    { onDelete: 'CASCADE' },
  )
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(
    () => Card,
    card => card.deck,
    { cascade: true },
  )
  cards: Card[];
}
