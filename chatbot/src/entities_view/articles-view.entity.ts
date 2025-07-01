import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({ name: "articles_view" })
export class ArticlesView {
  @ViewColumn()
  article_id!: number;

  @ViewColumn()
  title!: string;

  @ViewColumn()
  summary!: string;

  @ViewColumn()
  slug!: string;

  @ViewColumn()
  img_url!: string;

  @ViewColumn()
  isApprove!: boolean;

  @ViewColumn()
  topic!: string;

  @ViewColumn()
  author!: string;

  @ViewColumn()
  tags!: string;
}
