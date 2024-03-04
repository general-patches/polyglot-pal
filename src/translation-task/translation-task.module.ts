import { Module } from '@nestjs/common';
import { TranslationTaskService } from './translation-task.service';
import { TranslationTaskController } from './translation-task.controller';
import { TranslationTask } from './entities/translation-task.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([TranslationTask])],
  controllers: [TranslationTaskController],
  providers: [TranslationTaskService],
  exports: [TranslationTaskService],
})
export class TranslationTaskModule {}
