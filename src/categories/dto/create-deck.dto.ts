export class CreateDeckDto {
  categoryId: string;
  name: string;

  constructor(categoryId: string, name: string) {
    this.categoryId = categoryId;
    this.name = name;
  }
}
