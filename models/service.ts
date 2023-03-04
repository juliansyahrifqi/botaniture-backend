import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface serviceAttributes {
  id?: number;
  service_name?: string;
  service_description?: string;
  service_icon?: string;
}

@Table({ tableName: 'service', schema: 'public', timestamps: false })
export class service
  extends Model<serviceAttributes, serviceAttributes>
  implements serviceAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal("nextval('service_id_seq'::regclass)"),
  })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  service_name?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  service_description?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  service_icon?: string;
}
