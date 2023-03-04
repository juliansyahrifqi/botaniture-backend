import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface product_categoryAttributes {
  id?: number;
  category_name?: string;
  category_description?: string;
  category_slug?: string;
  category_image?: string;
}

@Table({ tableName: 'product_category', schema: 'public', timestamps: false })
export class product_category
  extends Model<product_categoryAttributes, product_categoryAttributes>
  implements product_categoryAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal(
      "nextval('product_category_id_seq'::regclass)",
    ),
  })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  category_name?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  category_description?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  category_slug?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  category_image?: string;
}
