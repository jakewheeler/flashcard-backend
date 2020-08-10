import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/categories.repository';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Deck } from './entities/deck.entity';
import { DeckRepository } from './repositories/decks.repository';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Card } from './entities/card.entity';
import { CardsRepository } from './repositories/cards.repository';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from 'src/auth/user.entity';
import { userInfo } from 'os';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(DeckRepository)
    private deckRepository: DeckRepository,
    @InjectRepository(CardsRepository)
    private cardRepository: CardsRepository,
  ) {}
  async getCategories(user: User): Promise<Category[]> {
    return this.categoryRepository.getCategories(user);
  }

  async getCategory(id: number, user: User): Promise<Category> {
    return this.categoryRepository.getCategory(id, user);
  }

  async updateCategory(
    updatedCategoryDto: UpdateCategoryDto,
    user: User,
  ): Promise<Category> {
    const category = await this.getCategory(updatedCategoryDto.id, user);
    category.name = updatedCategoryDto.name;
    await category.save();
    return category;
  }

  async deleteCategory(id: number, user: User): Promise<void> {
    const result = await this.categoryRepository.delete({
      id,
      userId: user.id,
    });
    if (result.affected === 0)
      throw new NotFoundException('No category with this ID');
  }

  async createCategory(name: string, user: User): Promise<Category> {
    return this.categoryRepository.createCategory(name, user);
  }

  /*
    Decks
  */
  async getDecks(categoryId: number): Promise<Deck[]> {
    return this.deckRepository.getDecks(categoryId);
  }

  async getDeck(categoryId: number, deckId: number): Promise<Deck> {
    return this.deckRepository.getDeck(categoryId, deckId);
  }

  async createDeck(createDeckDto: CreateDeckDto, user: User): Promise<Deck> {
    const { name, categoryId: id } = createDeckDto;

    // check if there's a check with the same name already in this category
    const deckExists = await this.deckRepository.find({
      category: { id },
      name,
    });

    if (deckExists.length) {
      throw new ForbiddenException(
        'Deck with this name already exists in this category.',
      );
    }

    const category = await this.categoryRepository.getCategory(id, user);
    const deck = new Deck();
    deck.category = category;
    deck.name = name;
    await deck.save();
    return deck;
  }

  async updateDeck(updateDeckDto: UpdateDeckDto): Promise<Deck> {
    const { name, categoryId, id } = updateDeckDto;
    const deck = await this.getDeck(categoryId, id);
    deck.name = name;
    await deck.save();
    return deck;
  }

  async deleteDeck(categoryId: number, id: number): Promise<void> {
    const result = await this.deckRepository.delete({
      category: { id: categoryId },
      id,
    });
    if (result.affected === 0)
      throw new NotFoundException('No deck with this ID');
  }

  /*
    Cards
  */

  async getCards(categoryId: number, deckId: number): Promise<Card[]> {
    const { id } = await this.getDeck(categoryId, deckId);
    const cards = await this.cardRepository.find({ deck: { id } });
    return cards;
  }

  async getCard(categoryId: number, deckId: number, id: number): Promise<Card> {
    const deck = await this.getDeck(categoryId, deckId);
    const card = await this.cardRepository.findOne({
      deck: { id: deck.id },
      id,
    });
    if (!card) {
      throw new NotFoundException('There is no card with this ID');
    }
    return card;
  }

  async createCard(
    categoryId: number,
    deckId: number,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const deck = await this.getDeck(categoryId, deckId);

    const { front, back, type } = createCardDto;

    const card = new Card();
    card.front = front;
    card.back = back;
    card.type = type;
    card.deck = deck;
    await card.save();
    return card;
  }

  async updateCard(
    categoryId: number,
    deckId: number,
    id: number,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const card = await this.getCard(categoryId, deckId, id);
    const { front, back, type } = createCardDto;
    card.front = front;
    card.back = back;
    card.type = type;
    await card.save();
    return card;
  }

  async deleteCard(
    categoryId: number,
    deckId: number,
    id: number,
  ): Promise<void> {
    const card = await this.getCard(categoryId, deckId, id);
    await this.cardRepository.delete(card);
  }
}
