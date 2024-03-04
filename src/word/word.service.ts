import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Word } from './entities/word.entity';

@Injectable()
export class WordService {
  constructor(
    @InjectModel(Word)
    private wordRepository: typeof Word,
  ) {}

  create(createWordDto: CreateWordDto) {
    return this.wordRepository.create(createWordDto as any);
  }

  findAll() {
    return this.wordRepository.findAll();
  }

  findOne(id: string) {
    return this.wordRepository.findByPk(id);
  }

  update(id: string, updateWordDto: UpdateWordDto) {
    return this.wordRepository.update(updateWordDto, {
      where: { id },
    });
  }

  remove(id: string) {
    return this.wordRepository.destroy({
      where: { id },
    });
  }
}
