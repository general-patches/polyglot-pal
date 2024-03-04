import {
  Column,
  Table,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Word } from 'src/word/entities/word.entity';

@Table({
  tableName: 'translation_task',
})
export class TranslationTask extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Word)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  word_id: number;

  @BelongsTo(() => Word)
  word: Word;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  targetSentence: string;

  @Column({
    type: DataType.TEXT,
  })
  questionPhrase: string;

  @Column({
    type: DataType.TEXT,
  })
  userTranslation: string;

  @Column({
    type: DataType.TEXT,
  })
  feedback: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  correct: boolean;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  completedAt: Date;
}
