import { Test, TestingModule } from '@nestjs/testing';
import { TranslationTaskController } from './translation-task.controller';
import { TranslationTaskService } from './translation-task.service';

describe('TranslationTaskController', () => {
  let controller: TranslationTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationTaskController],
      providers: [TranslationTaskService],
    }).compile();

    controller = module.get<TranslationTaskController>(TranslationTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
