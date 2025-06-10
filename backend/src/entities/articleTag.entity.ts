import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Article from './article.entity';
import Tag from './tag.entity';

@Entity('article_tags')
export default class ArticleTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (a) => a.tags)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => Tag, (t) => t.articles)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
