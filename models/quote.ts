import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface quoteAttributes {
  id: number;
  quote_description?: string;
  quote_author?: string;
  quote_image?: string;
}

@Table({ tableName: 'quote', schema: 'public', timestamps: false })
export class quote
  extends Model<quoteAttributes, quoteAttributes>
  implements quoteAttributes
{
  @Column({ primaryKey: true, type: DataType.INTEGER })
  @Index({ name: 'quote_pkey', using: 'btree', unique: true })
  id!: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  quote_description?: string;

  @Column({ allowNull: true, type: DataType.STRING(150) })
  quote_author?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  quote_image?: string;
}
