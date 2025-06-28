import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1709107200000 implements MigrationInterface {
  name = 'InitialSetup1709107200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 創建組織表
    await queryRunner.query(`
      CREATE TABLE "organization" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "settings" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    // 創建環境表
    await queryRunner.query(`
      CREATE TABLE "environment" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "type" varchar NOT NULL DEFAULT 'development',
        "security_level" integer NOT NULL DEFAULT 1,
        "settings" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "organization_id" uuid,
        CONSTRAINT "fk_environment_organization" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE
      )
    `);

    // 創建服務表
    await queryRunner.query(`
      CREATE TABLE "service" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "type" varchar NOT NULL DEFAULT 'application',
        "status" varchar NOT NULL DEFAULT 'active',
        "settings" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "environment_id" uuid,
        CONSTRAINT "fk_service_environment" FOREIGN KEY ("environment_id") REFERENCES "environment"("id") ON DELETE CASCADE
      )
    `);

    // 創建管理員表
    await queryRunner.query(`
      CREATE TABLE "administrator" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "type" varchar NOT NULL DEFAULT 'system',
        "status" varchar NOT NULL DEFAULT 'active',
        "permissions" jsonb,
        "settings" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "service_id" uuid,
        CONSTRAINT "fk_administrator_service" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE
      )
    `);

    // 創建憑證表
    await queryRunner.query(`
      CREATE TABLE "credential" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "type" varchar NOT NULL DEFAULT 'password',
        "status" varchar NOT NULL DEFAULT 'active',
        "username" text,
        "encrypted_value" text NOT NULL,
        "metadata" jsonb,
        "expires_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "service_id" uuid,
        CONSTRAINT "fk_credential_service" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE
      )
    `);

    // 創建團隊表
    await queryRunner.query(`
      CREATE TABLE "team" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "settings" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    // 創建團隊成員關聯表
    await queryRunner.query(`
      CREATE TABLE "team_administrators" (
        "team_id" uuid NOT NULL,
        "administrator_id" uuid NOT NULL,
        CONSTRAINT "pk_team_administrators" PRIMARY KEY ("team_id", "administrator_id"),
        CONSTRAINT "fk_team_administrators_team" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_team_administrators_administrator" FOREIGN KEY ("administrator_id") REFERENCES "administrator"("id") ON DELETE CASCADE
      )
    `);

    // 創建團隊憑證關聯表
    await queryRunner.query(`
      CREATE TABLE "team_credentials" (
        "team_id" uuid NOT NULL,
        "credential_id" uuid NOT NULL,
        CONSTRAINT "pk_team_credentials" PRIMARY KEY ("team_id", "credential_id"),
        CONSTRAINT "fk_team_credentials_team" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_team_credentials_credential" FOREIGN KEY ("credential_id") REFERENCES "credential"("id") ON DELETE CASCADE
      )
    `);

    // 創建環境連接表
    await queryRunner.query(`
      CREATE TABLE "environment_connection" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "type" varchar NOT NULL DEFAULT 'network',
        "settings" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "source_environment_id" uuid,
        "target_environment_id" uuid,
        CONSTRAINT "fk_environment_connection_source" FOREIGN KEY ("source_environment_id") REFERENCES "environment"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_environment_connection_target" FOREIGN KEY ("target_environment_id") REFERENCES "environment"("id") ON DELETE CASCADE
      )
    `);

    // 創建索引
    await queryRunner.query(
      `CREATE INDEX "idx_organization_name" ON "organization"("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_environment_name" ON "environment"("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_environment_type" ON "environment"("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_service_name" ON "service"("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_service_type" ON "service"("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_service_status" ON "service"("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_administrator_name" ON "administrator"("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_administrator_type" ON "administrator"("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_administrator_status" ON "administrator"("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_credential_name" ON "credential"("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_credential_type" ON "credential"("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_credential_status" ON "credential"("status")`,
    );
    await queryRunner.query(`CREATE INDEX "idx_team_name" ON "team"("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 刪除索引
    await queryRunner.query(`DROP INDEX "idx_team_name"`);
    await queryRunner.query(`DROP INDEX "idx_credential_status"`);
    await queryRunner.query(`DROP INDEX "idx_credential_type"`);
    await queryRunner.query(`DROP INDEX "idx_credential_name"`);
    await queryRunner.query(`DROP INDEX "idx_administrator_status"`);
    await queryRunner.query(`DROP INDEX "idx_administrator_type"`);
    await queryRunner.query(`DROP INDEX "idx_administrator_name"`);
    await queryRunner.query(`DROP INDEX "idx_service_status"`);
    await queryRunner.query(`DROP INDEX "idx_service_type"`);
    await queryRunner.query(`DROP INDEX "idx_service_name"`);
    await queryRunner.query(`DROP INDEX "idx_environment_type"`);
    await queryRunner.query(`DROP INDEX "idx_environment_name"`);
    await queryRunner.query(`DROP INDEX "idx_organization_name"`);

    // 刪除表
    await queryRunner.query(`DROP TABLE "environment_connection"`);
    await queryRunner.query(`DROP TABLE "team_credentials"`);
    await queryRunner.query(`DROP TABLE "team_administrators"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "credential"`);
    await queryRunner.query(`DROP TABLE "administrator"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TABLE "environment"`);
    await queryRunner.query(`DROP TABLE "organization"`);
  }
}
