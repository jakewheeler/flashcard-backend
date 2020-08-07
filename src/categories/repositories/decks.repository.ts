import { EntityRepository, Repository } from 'typeorm';
import { Deck } from '../entities/deck.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
  async getDecks(categoryId: number): Promise<Deck[]> {
    const decks = await this.find({ category: { id: categoryId } });
    return decks;
  }

  async getDeck(categoryId: number, id: number): Promise<Deck> {
    const deck = await this.findOne({ category: { id: categoryId }, id });
    if (!deck) {
      throw new NotFoundException('No deck with this ID found');
    }
    return deck;
  }
}
