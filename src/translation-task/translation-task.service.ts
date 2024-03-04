import { Injectable } from '@nestjs/common';
import { TranslationTask } from './entities/translation-task.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { readFile } from 'fs/promises';
import OpenAI from 'openai';

@Injectable()
export class TranslationTaskService {
  private openai: OpenAI;

  constructor(
    @InjectModel(TranslationTask)
    private translationTaskRepository: typeof TranslationTask,
    private sequelize: Sequelize,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async serveQuestionPage(taskId: number): Promise<string> {
    const content = await readFile('resources/translation-task.html', 'utf8');
    const task = await this.translationTaskRepository.findByPk(taskId);
    return content
      .replace('{{LANGUAGE}}', 'Italian')
      .replace('{{POST_URL}}', `/translation-tasks/${taskId}`)
      .replace('{{QUESTION_PHRASE}}', task.questionPhrase);
  }

  async serveAnswerPage(taskId: number, body: any): Promise<string> {
    const content = await readFile(
      'resources/translation-task-answer.html',
      'utf8',
    );
    const task = await this.translationTaskRepository.findByPk(taskId);
    task.userTranslation = body.answer;
    task.completedAt = new Date();
    const grading = await this.gradeAnswer(task);
    task.correct = grading.correct;
    task.feedback = grading.feedback;
    task.save();
    const heading = grading.correct ? 'Correct!' : 'Incorrect 🙁';
    const newTaskId = await this.getNextTaskId();
    return content
      .replace('{{ANSWER_HEADING}}', heading)
      .replace('{{ORIGINAL_SENTENCE}}', task.questionPhrase)
      .replace('{{TARGET_SENTENCE}}', task.targetSentence)
      .replace('{{FEEDBACK_DETAILS}}', grading.feedback)
      .replace('{{USER_ANSWER}}', task.userTranslation)
      .replace('{{TRANSLATION_TASK_URL}}', `/translation-tasks/${newTaskId}`);
  }

  async getNextTaskId() {
    const tasks = await this.translationTaskRepository.findAll({
      where: { completedAt: null },
    });
    if (tasks.length > 0) {
      if (tasks.length <= 1) {
        this.createTask();
      }
      return tasks[0].id;
    }
    this.createTask();
    return (await this.createTask()).id;
  }

  async createTask() {
    const sqlQuery = `
    select word.id as word_id, word.text as word
      from word
        left join translation_task on word.id = translation_task.word_id
      group by word.id
      order by count(translation_task.id) asc, 'word.order' asc
      limit 1
    `;

    try {
      const results = await this.sequelize.query(sqlQuery);
      const wordId = results[0][0]['word_id'];
      const word = results[0][0]['word'];
      const translationTask = new TranslationTask();
      translationTask.word_id = wordId;
      const taskSentences = await this.generateTaskSentences(word);
      translationTask.targetSentence = taskSentences.italian;
      translationTask.questionPhrase = taskSentences.english;
      translationTask.createdAt = new Date();
      return await translationTask.save();
    } catch (error) {
      console.error('Error executing SQL query:', error);
    }
  }

  async generateTaskSentences(word: string) {
    const languageLevel = process.env.LANGUAGE_LEVEL;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Please create a sentence in Italian that uses the word '${word}' at language level ${languageLevel}, then also generate the translation in English and provide me with only a json object with properties 'italian' and 'english'.`,
        },
      ],
    });
    console.log(response.choices[0].message.content);
    const json = JSON.parse(response.choices[0].message.content);
    return json;
  }

  async gradeAnswer(task: TranslationTask) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Grade the translation '${task.userTranslation}' for the sentence '${task.questionPhrase}', please provide a json object with two fields, the first a boolean field correct and then a feedback field that contains useful concise feedback.`,
        },
      ],
    });
    console.log(response.choices[0].message.content);
    const json = JSON.parse(response.choices[0].message.content);
    return json;
  }
}
