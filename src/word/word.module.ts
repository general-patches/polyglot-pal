import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { Word } from './entities/word.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Word])],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}
