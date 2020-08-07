import { CreateDeckDto } from './create-deck.dto';

export class UpdateDeckDto extends CreateDeckDto {
  id: number;

  constructor(categoryId: number, name: string, id: number) {
    super(categoryId, name);
    this.id = id;
  }
}
