import { EntityRepository, Repository } from 'typeorm';
import { Deck } from '../entities/deck.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
}
