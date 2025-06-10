import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndex1749538081533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_username" ON "users" ("username")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_date" ON "appointments" ("appointment_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_patient" ON "appointments" ("patient_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_doctor" ON "appointments" ("doctor_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_articles_slug" ON "articles" ("slug")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_articles_author" ON "articles" ("author_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_roles_user" ON "user_roles" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_roles_role" ON "user_roles" ("role_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_tags_article" ON "article_tags" ("article_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_tags_tag" ON "article_tags" ("tag_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_doctors_specialty" ON "doctors" ("specialty_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_doctors_user" ON "doctors" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_health_profile_patient" ON "health_profile" ("patient_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_users_username"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_date"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_patient"`);
    await queryRunner.query(`DROP INDEX "IDX_articles_slug"`);
    await queryRunner.query(`DROP INDEX "IDX_articles_author"`);
    await queryRunner.query(`DROP INDEX "IDX_user_roles_user"`);
    await queryRunner.query(`DROP INDEX "IDX_user_roles_role"`);
    await queryRunner.query(`DROP INDEX "IDX_article_tags_article"`);
    await queryRunner.query(`DROP INDEX "IDX_article_tags_tag"`);
    await queryRunner.query(`DROP INDEX "IDX_doctors_specialty"`);
    await queryRunner.query(`DROP INDEX "IDX_doctors_user"`);
    await queryRunner.query(`DROP INDEX "IDX_health_profile_patient"`);
  }
}
