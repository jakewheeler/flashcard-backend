import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryId: string;

  @Column()
  deckId: string;

  @Column()
  front: string;

  @Column()
  back: string;

  @Generated()
  orderInDeck: number;

  @Column()
  type: string;
}
