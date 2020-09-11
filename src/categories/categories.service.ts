import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
  async getDecks(categoryId: number, user: User): Promise<Deck[]> {
    const category = await this.categoryRepository.getCategory(
      categoryId,
      user,
    );
    const decks = await this.deckRepository.find({
      category: { id: category.id },
    });

    return decks;
  }

  async getAllDecksByUser(user: User): Promise<Deck[]> {
    return this.deckRepository.getAllDecksByUser(user);
  }

  async getDeck(categoryId: number, id: number, user: User): Promise<Deck> {
    const category = await this.categoryRepository.getCategory(
      categoryId,
      user,
    );
    const deck = await this.deckRepository.findOne({
      category: { id: category.id },
      id,
    });
    if (!deck) {
      throw new NotFoundException('No deck with this ID found');
    }
    return deck;
  }

  async createDeck(createDeckDto: CreateDeckDto, user: User): Promise<Deck> {
    const { name, categoryId: id } = createDeckDto;

    // check if there's a check with the same name already in this category
    const deckExists = await this.deckRepository.find({
      name,
    });

    if (deckExists.length) {
      throw new ForbiddenException('Deck with this name already exists.');
    }

    const category = await this.categoryRepository.getCategory(id, user);
    const deck = new Deck();
    deck.category = category;
    deck.name = name;
    await deck.save();
    return deck;
  }

  async updateDeck(updateDeckDto: UpdateDeckDto, user: User): Promise<Deck> {
    const { name, categoryId, id } = updateDeckDto;

    const deckExists = await this.deckRepository.find({
      name,
    });

    if (deckExists.length) {
      throw new ForbiddenException('Deck with this name already exists.');
    }

    if (!name || name === '') {
      throw new BadRequestException('Deck name must be provided');
    }

    const deck = await this.getDeck(categoryId, id, user);

    deck.name = name;
    await deck.save();
    return deck;
  }

  async deleteDeck(categoryId: number, id: number, user: User): Promise<void> {
    const deckToDelete = await this.getDeck(categoryId, id, user);
    const result = await this.deckRepository.delete(deckToDelete);
    if (result.affected === 0)
      throw new NotFoundException('No deck with this ID');
  }

  /*
    Cards
  */

  async getCards(
    categoryId: number,
    deckId: number,
    user: User,
  ): Promise<Card[]> {
    const { id } = await this.getDeck(categoryId, deckId, user);
    const cards = await this.cardRepository.find({ deck: { id } });
    return cards;
  }

  async getCard(
    categoryId: number,
    deckId: number,
    id: number,
    user: User,
  ): Promise<Card> {
    const deck = await this.getDeck(categoryId, deckId, user);
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
    user: User,
  ): Promise<Card> {
    const deck = await this.getDeck(categoryId, deckId, user);

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
    user: User,
  ): Promise<Card> {
    const card = await this.getCard(categoryId, deckId, id, user);
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
    user: User,
  ): Promise<void> {
    const card = await this.getCard(categoryId, deckId, id, user);
    await this.cardRepository.delete(card);
  }
}
