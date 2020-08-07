import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Deck } from './deck.entity';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(
    type => Deck,
    deck => deck.cards,
  )
  deck: Deck;

  @Column()
  front: string;

  @Column()
  back: string;

  @Generated('increment')
  @Column()
  orderInDeck: number;

  @Column()
  type: string;
}
