import { EntityRepository, Repository } from 'typeorm';
import { Deck, DecksByCategoryObj } from '../entities/deck.entity';
import { User } from 'src/auth/user.entity';
import { Category } from '../entities/category.entity';

function groupBy(list: Deck[], keyGetter: (deck: Deck) => string): DecksByCategoryObj {
  const obj = {};
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = obj[key];
    if (!collection) {
      obj[key] = [item];
    } else {
      collection.push(item);
    }
  });
  return obj;
}

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
  async getAllDecksByUser(user: User): Promise<DecksByCategoryObj> {
    const decks: Deck[] = await this.createQueryBuilder('deck')
      .innerJoinAndSelect(
        Category,
        'category',
        'deck."categoryId" = category.id',
      )
      .innerJoinAndSelect(User, 'user', 'category."userId" = user.id')
      .where('user.id = :id', { id: user.id })
      .getMany();

    const gb = groupBy(decks, d => String(d.categoryId));
    return gb;
  }
}
