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

}
