import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface usersAttributes {
  id?: number;
  user_firstname?: string;
  user_lastname?: string;
  user_email?: string;
  user_username?: string;
  user_phone_number?: string;
  user_password?: string;
  user_role?: number;
}

@Table({ tableName: 'users', schema: 'public', timestamps: false })
export class users
  extends Model<usersAttributes, usersAttributes>
  implements usersAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal("nextval('users_id_seq'::regclass)"),
  })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(150) })
  user_firstname?: string;

  @Column({ allowNull: true, type: DataType.STRING(150) })
  user_lastname?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  user_email?: string;

  @Column({ allowNull: true, type: DataType.STRING(120) })
  user_username?: string;

  @Column({ allowNull: true, type: DataType.STRING(25) })
  user_phone_number?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  user_password?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  user_role?: number;
}
