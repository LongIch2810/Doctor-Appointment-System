import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Topic from './topic.entity';
import ArticleTag from './articleTag.entity';
import Tag from './tag.entity';
import User from './user.entity';

@Entity('articles')
export default class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  img_url: string;

  @Column({ nullable: false })
  summary: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ default: false })
  isApprove: boolean;

  @ManyToOne(() => Topic, (t) => t.articles)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @OneToMany(() => ArticleTag, (at) => at.article)
  tags: Tag[];

  @ManyToOne(() => User, (u) => u.articles)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
