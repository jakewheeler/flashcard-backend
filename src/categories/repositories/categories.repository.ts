import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ForbiddenException } from '@nestjs/common';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getCategories(): Promise<Category[]> {
    const categories = await this.find();
    return categories;
  }

  async createCategory(name: string): Promise<Category> {
    const query = this.createQueryBuilder('category');
    query.where('category.name = :catName', { catName: name });

    const categoryExists = (await query.getCount()) >= 1;

    if (categoryExists) {
      throw new ForbiddenException('Category with this name already exists');
    }

    const category = new Category();
    category.name = name;
    await category.save();
    return category;
  }
}