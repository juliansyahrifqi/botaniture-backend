import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface payment_methodAttributes {
  id?: number;
  payment_method_name?: string;
  payment_method_norek?: string;
  payment_method_image?: string;
}

@Table({ tableName: 'payment_method', schema: 'public', timestamps: false })
export class payment_method
  extends Model<payment_methodAttributes, payment_methodAttributes>
  implements payment_methodAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal(
      "nextval('payment_method_id_seq'::regclass)",
    ),
  })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  payment_method_name?: string;

  @Column({ allowNull: true, type: DataType.STRING(100) })
  payment_method_norek?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  payment_method_image?: string;
}
