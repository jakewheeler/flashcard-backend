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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(DeckRepository)
    private deckRepository: DeckRepository,
  ) {}
  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }

  async getCategory(id: number): Promise<Category> {
    return this.categoryRepository.getCategory(id);
  }

  async updateCategory(
    updatedCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategory(updatedCategoryDto.id);
    category.name = updatedCategoryDto.name;
    await category.save();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException('No category with this ID');
  }

  async createCategory(name: string): Promise<Category> {
    return this.categoryRepository.createCategory(name);
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

  async createDeck(createDeckDto: CreateDeckDto): Promise<Deck> {
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

    const category = await this.categoryRepository.getCategory(id);
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
}
