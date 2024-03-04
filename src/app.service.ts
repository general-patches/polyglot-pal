import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { TranslationTaskService } from './translation-task/translation-task.service';

@Injectable()
export class AppService {
  constructor(
    private readonly translationTaskService: TranslationTaskService,
  ) {}

  async serveIndexPage(): Promise<string> {
    const content = await readFile('resources/index.html', 'utf8');
    const translationTaskId = await this.translationTaskService.getNextTaskId();
    return content.replace(
      '{{TRANSLATION_TASK_URL}}',
      `/translation-tasks/${translationTaskId}`,
    );
  }
}
