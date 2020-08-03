import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
@Unique(['name'])
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(
    type => Category,
    category => category.decks,
    { eager: false },
  )
  category: Category;

  @Column()
  categoryId: string;
}
