import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'word',
})
export class Word extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order: number;
}
