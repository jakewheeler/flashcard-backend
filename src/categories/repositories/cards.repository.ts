import { EntityRepository, Repository } from 'typeorm';
import { Card } from '../entities/card.entity';
import { Deck } from '../entities/deck.entity';

@EntityRepository(Card)
export class CardsRepository extends Repository<Card> {}
