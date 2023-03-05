import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { users } from './users';

export interface blogsAttributes {
  id?: number;
  blog_title?: string;
  blog_slug?: string;
  blog_body?: string;
  blog_image?: string;
  date_created?: string;
  user_id?: number;
}

@Table({ tableName: 'blogs', schema: 'public', timestamps: false })
export class blogs
  extends Model<blogsAttributes, blogsAttributes>
  implements blogsAttributes
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    defaultValue: Sequelize.literal("nextval('blogs_id_seq'::regclass)"),
  })
  @Index({ name: 'blogs_pkey', using: 'btree', unique: true })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  blog_title?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  blog_slug?: string;

  @Column({ allowNull: true, type: DataType.STRING })
  blog_body?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  blog_image?: string;

  @Column({ allowNull: true, type: DataType.STRING })
  date_created?: string;

  @ForeignKey(() => users)
  @Column({ allowNull: true, type: DataType.INTEGER })
  user_id?: number;

  @BelongsTo(() => users)
  user?: users;
}
