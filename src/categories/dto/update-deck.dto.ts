import { CreateDeckDto } from './create-deck.dto';

export class UpdateDeckDto extends CreateDeckDto {
  deckId: string;

  constructor(categoryId: string, name: string, deckId: string) {
    super(categoryId, name);
    this.deckId = deckId;
  }
}
