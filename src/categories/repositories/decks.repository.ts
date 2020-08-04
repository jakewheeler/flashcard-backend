import { EntityRepository, Repository } from 'typeorm';
import { Deck } from '../entities/deck.entity';
import { CreateDeckDto } from '../dto/create-deck.dto';
import { ForbiddenException } from '@nestjs/common';

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
  async getDecks(categoryId: string): Promise<Deck[]> {
    const decks = await this.find({ categoryId });
    return decks;
  }

  async createDeck(createDeckDto: CreateDeckDto): Promise<Deck> {
    const query = this.createQueryBuilder('deck');
    query.where('deck.categoryId = :id', { id: createDeckDto.categoryId });
    query.andWhere('deck.name = :name', { name: createDeckDto.name });

    const deckExists = (await query.getCount()) >= 1;

    if (deckExists) {
      throw new ForbiddenException(
        'Deck with this name already exists in this category.',
      );
    }

    const deck = new Deck();
    deck.name = createDeckDto.name;
    deck.categoryId = createDeckDto.categoryId;
    await deck.save();
    return deck;
  }
}
