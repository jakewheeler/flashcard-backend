import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/categories.repository';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Deck } from './entities/deck.entity';
import { DeckRepository } from './repositories/decks.repository';
import { CreateDeckDto } from './dto/create-deck.dto';

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

  async getCategory(id: string): Promise<Category> {
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

  async deleteCategory(id: string): Promise<void> {
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
  async getDecks(categoryId: string): Promise<Deck[]> {
    return this.deckRepository.getDecks(categoryId);
  }

  async createDeck(createDeckDto: CreateDeckDto): Promise<Deck> {
    return this.deckRepository.createDeck(createDeckDto);
  }
}
