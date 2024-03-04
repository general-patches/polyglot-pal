import { Test, TestingModule } from '@nestjs/testing';
import { TranslationTaskService } from './translation-task.service';

describe('TranslationTaskService', () => {
  let service: TranslationTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationTaskService],
    }).compile();

    service = module.get<TranslationTaskService>(TranslationTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
