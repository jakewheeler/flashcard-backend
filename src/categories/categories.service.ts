import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}
  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }

  async createCategory(name: string): Promise<Category> {
    return this.categoryRepository.createCategory(name);
  }
}
