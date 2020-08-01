import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

/*
    Categories are the top level entry point into the app
*/
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Post()
  async createCategory(@Body('name') name: string): Promise<Category> {
    return this.categoriesService.createCategory(name);
  }
}
