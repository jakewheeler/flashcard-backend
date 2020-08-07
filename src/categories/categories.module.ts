import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/categories.repository';
import { DeckRepository } from './repositories/decks.repository';
import { CardsRepository } from './repositories/cards.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryRepository,
      DeckRepository,
      CardsRepository,
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
