import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Deck } from './deck.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(
    type => Deck,
    deck => deck.category,
  )
  decks: Deck[];

  @ManyToOne(
    type => User,
    user => user.categories,
  )
  user: User;

  @Column()
  userId: number;
}
