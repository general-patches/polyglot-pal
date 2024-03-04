import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import { TranslationTaskModule } from './translation-task/translation-task.module';
import { WordModule } from './word/word.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot(dataBaseConfig),
    TranslationTaskModule,
    WordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
