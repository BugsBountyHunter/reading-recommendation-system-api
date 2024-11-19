import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateTimeToInterval1732049664521 implements MigrationInterface {
  name = 'AddDateTimeToInterval1732049664521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_intervals" DROP COLUMN "created_at"`,
    );
  }
}
