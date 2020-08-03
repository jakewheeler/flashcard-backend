import { EntityRepository, Repository } from 'typeorm';
import { Deck } from '../entities/deck.entity';

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
  async getDecks(categoryId: string): Promise<Deck[]> {
    const decks = await this.find({ categoryId });
    return decks;
  }
}
