import { EntityRepository, Repository } from 'typeorm';
import { Deck } from '../entities/deck.entity';
import { User } from 'src/auth/user.entity';
import { Category } from '../entities/category.entity';

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
  async getAllDecksByUser(user: User): Promise<Deck[]> {
    const decks: Deck[] = await this.createQueryBuilder('deck')
      .innerJoinAndSelect(
        Category,
        'category',
        'deck."categoryId" = category.id',
      )
      .innerJoinAndSelect(User, 'user', 'category."userId" = user.id')
      .where('user.id = :id', { id: user.id })
      .getMany();

    return decks;
  }
}
