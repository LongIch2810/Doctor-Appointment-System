import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrantChatbotReadOnly1749460856323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //1.Tạo user chatbot_readonly nếu chưa có
    await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='chatbot_readonly') THEN
                    CREATE USER chatbot_readonly WITH PASSWORD '123456';
                END IF;
            END
            $$;
            `);

    //2.Cấp quyền đọc trên các views
    await queryRunner.query(`
            GRANT SELECT ON doctors_view TO chatbot_readonly;
        `);
    await queryRunner.query(`
            GRANT SELECT ON articles_view TO chatbot_readonly;
        `);
    await queryRunner.query(`
            GRANT SELECT ON specialties_view TO chatbot_readonly;
        `);

    // 3. Đảm bảo không cho quyền trên bảng thật (tùy chọn, tăng bảo mật)
    await queryRunner.query(`
      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM chatbot_readonly;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `REVOKE SELECT ON specialties_view FROM chatbot_readonly`,
    );
    await queryRunner.query(
      `REVOKE SELECT ON articles_view FROM chatbot_readonly`,
    );
    await queryRunner.query(
      `REVOKE SELECT ON doctors_view FROM chatbot_readonly`,
    );
    await queryRunner.query(`DROP USER IF EXISTS chatbot_readonly`);
  }
}
