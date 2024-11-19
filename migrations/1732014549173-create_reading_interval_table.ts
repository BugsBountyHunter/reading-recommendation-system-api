import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReadingIntervalTable1732014549173
  implements MigrationInterface
{
  name = 'CreateReadingIntervalTable1732014549173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reading_intervals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_page" integer NOT NULL, "end_page" integer NOT NULL, "user_id" uuid, "book_id" uuid, CONSTRAINT "PK_e88685b4093b050e5cbd43c20de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" ADD CONSTRAINT "FK_23ca4595fdcb7eaec643e1ba565" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" ADD CONSTRAINT "FK_c639aeceda9c361f3cf88914ad6" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" DROP CONSTRAINT "FK_c639aeceda9c361f3cf88914ad6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" DROP CONSTRAINT "FK_23ca4595fdcb7eaec643e1ba565"`,
    );
    await queryRunner.query(`DROP TABLE "reading_intervals"`);
  }
}
