import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface productAttributes {
  id?: number;
  product_name?: string;
  product_description?: string;
  product_price?: string;
  product_discount?: string;
  product_image?: string;
  category_id?: number;
}

@Table({ tableName: 'product', schema: 'public', timestamps: false })
export class product
  extends Model<productAttributes, productAttributes>
  implements productAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal("nextval('product_id_seq'::regclass)"),
  })
  @Index({ name: 'product_pkey', using: 'btree', unique: true })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(150) })
  product_name?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  product_description?: string;

  @Column({ allowNull: true, type: DataType.NUMBER })
  product_price?: string;

  @Column({ allowNull: true, type: DataType.DECIMAL })
  product_discount?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  product_image?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  category_id?: number;
}
