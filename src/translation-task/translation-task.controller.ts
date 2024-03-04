import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TranslationTaskService } from './translation-task.service';

@Controller('translation-tasks')
export class TranslationTaskController {
  constructor(
    private readonly translationTaskService: TranslationTaskService,
  ) {}

  @Get(':id')
  async getQuestion(@Param('id') id: string): Promise<string> {
    const taskId = parseInt(id, 10);
    return await this.translationTaskService.serveQuestionPage(taskId);
  }

  @Post(':id')
  async getAnswer(@Param('id') id: string, @Body() body: any): Promise<string> {
    const taskId = parseInt(id, 10);
    return await this.translationTaskService.serveAnswerPage(taskId, body);
  }
}
