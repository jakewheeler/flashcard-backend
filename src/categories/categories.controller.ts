import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Deck } from './entities/deck.entity';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

/*
    Categories are the top level entry point into the app
*/
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // return all categories
  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.getCategory(id);
  }

  @Post()
  async createCategory(@Body('name') name: string): Promise<Category> {
    return this.categoriesService.createCategory(name);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Category> {
    const dto = new UpdateCategoryDto(id, name);
    return this.categoriesService.updateCategory(dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }

  /*
    Decks
  */

  @Get(':id/decks')
  async getDecks(@Param('id') categoryId: string): Promise<Deck[]> {
    return this.categoriesService.getDecks(categoryId);
  }

  @Get(':categoryId/decks/:deckId')
  async getDeck(
    @Param('categoryId') categoryId: string,
    @Param('deckId') deckId: string,
  ): Promise<Deck> {
    return this.categoriesService.getDeck(categoryId, deckId);
  }

  @Post(':id/decks')
  async createDeck(
    @Param('id') categoryId: string,
    @Body('name') name: string,
  ): Promise<Deck> {
    const dto = new CreateDeckDto(categoryId, name);
    return this.categoriesService.createDeck(dto);
  }

  @Patch(':categoryId/decks/:id')
  async updateDeck(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Deck> {
    const dto = new UpdateDeckDto(categoryId, name, id);
    return this.categoriesService.updateDeck(dto);
  }

  @Delete(':categoryId/decks/:id')
  async deleteDeck(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.categoriesService.deleteDeck(categoryId, id);
  }
}
