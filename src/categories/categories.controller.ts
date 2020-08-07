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
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';

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
  async getCategory(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.getCategory(id);
  }

  @Post()
  async createCategory(@Body('name') name: string): Promise<Category> {
    return this.categoriesService.createCategory(name);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body('name') name: string,
  ): Promise<Category> {
    const dto = new UpdateCategoryDto(id, name);
    return this.categoriesService.updateCategory(dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }

  /*
    Decks
  */

  @Get(':id/decks')
  async getDecks(@Param('id') id: number): Promise<Deck[]> {
    return this.categoriesService.getDecks(id);
  }

  @Get(':categoryId/decks/:id')
  async getDeck(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
  ): Promise<Deck> {
    return this.categoriesService.getDeck(categoryId, id);
  }

  @Post(':id/decks')
  async createDeck(
    @Param('id') categoryId: number,
    @Body('name') name: string,
  ): Promise<Deck> {
    const dto = new CreateDeckDto(categoryId, name);
    return this.categoriesService.createDeck(dto);
  }

  @Patch(':categoryId/decks/:id')
  async updateDeck(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
    @Body('name') name: string,
  ): Promise<Deck> {
    const dto = new UpdateDeckDto(categoryId, name, id);
    return this.categoriesService.updateDeck(dto);
  }

  @Delete(':categoryId/decks/:id')
  async deleteDeck(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
  ): Promise<void> {
    return this.categoriesService.deleteDeck(categoryId, id);
  }

  /*
    Cards
  */

  @Get(':categoryId/decks/:deckId/cards')
  async getCards(
    @Param('categoryId') categoryId: number,
    @Param('deckId') deckId: number,
  ): Promise<Card[]> {
    return this.categoriesService.getCards(categoryId, deckId);
  }

  @Get(':categoryId/decks/:deckId/cards/:id')
  async getCard(
    @Param('categoryId') categoryId: number,
    @Param('deckId') deckId: number,
    @Param('id') id: number,
  ): Promise<Card> {
    return this.categoriesService.getCard(categoryId, deckId, id);
  }

  @Post(':categoryId/decks/:deckId/cards')
  async createCard(
    @Param('categoryId') categoryId: number,
    @Param('deckId') deckId: number,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.categoriesService.createCard(categoryId, deckId, createCardDto);
  }

  @Patch(':categoryId/decks/:deckId/cards/:id')
  async updateCard(
    @Param('categoryId') categoryId: number,
    @Param('deckId') deckId: number,
    @Param('id') id: number,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.categoriesService.updateCard(
      categoryId,
      deckId,
      id,
      createCardDto,
    );
  }

  @Delete(':categoryId/decks/:deckId/cards/:id')
  async deleteCard(
    @Param('categoryId') categoryId: number,
    @Param('deckId') deckId: number,
    @Param('id') id: number,
  ): Promise<void> {
    return this.categoriesService.deleteCard(categoryId, deckId, id);
  }
}
