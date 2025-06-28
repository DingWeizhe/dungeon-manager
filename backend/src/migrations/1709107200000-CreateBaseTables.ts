import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBaseTables1709107200000 implements MigrationInterface {
  name = 'CreateBaseTables1709107200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 創建 tenants 表
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "domain" varchar(255) UNIQUE,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1
      )
    `);

    // 創建 tenant_admins 表
    await queryRunner.query(`
      CREATE TABLE "tenant_admins" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_tenant_admins_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "uq_tenant_admins_email" UNIQUE ("tenant_id", "email")
      )
    `);

    // 創建 organizations 表
    await queryRunner.query(`
      CREATE TABLE "organizations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        "updated_by" uuid NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_organizations_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
      )
    `);

    // 創建 users 表
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "organization_id" uuid,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "first_name" varchar(100),
        "last_name" varchar(100),
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "role" varchar(50) NOT NULL DEFAULT 'user',
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        "updated_by" uuid NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_users_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "fk_users_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id"),
        CONSTRAINT "uq_users_email" UNIQUE ("tenant_id", "email")
      )
    `);

    // 創建 environments 表
    await queryRunner.query(`
      CREATE TABLE "environments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "organization_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "type" varchar(50) NOT NULL DEFAULT 'development',
        "security_level" integer NOT NULL DEFAULT 1,
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        "updated_by" uuid NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_environments_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "fk_environments_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
      )
    `);

    // 創建 services 表
    await queryRunner.query(`
      CREATE TABLE "services" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "environment_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "type" varchar(50) NOT NULL DEFAULT 'application',
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        "updated_by" uuid NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_services_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "fk_services_environment" FOREIGN KEY ("environment_id") REFERENCES "environments"("id")
      )
    `);

    // 創建 credentials 表
    await queryRunner.query(`
      CREATE TABLE "credentials" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "service_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "type" varchar(50) NOT NULL DEFAULT 'password',
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "username" text,
        "encrypted_value" text NOT NULL,
        "metadata" jsonb,
        "expires_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        "updated_by" uuid NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_credentials_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "fk_credentials_service" FOREIGN KEY ("service_id") REFERENCES "services"("id")
      )
    `);

    // 創建 teams 表
    await queryRunner.query(`
      CREATE TABLE "teams" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "organization_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "settings" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        "updated_by" uuid NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "fk_teams_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "fk_teams_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
      )
    `);

    // 創建 team_members 表
    await queryRunner.query(`
      CREATE TABLE "team_members" (
        "team_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "tenant_id" uuid NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'member',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        CONSTRAINT "pk_team_members" PRIMARY KEY ("team_id", "user_id"),
        CONSTRAINT "fk_team_members_team" FOREIGN KEY ("team_id") REFERENCES "teams"("id"),
        CONSTRAINT "fk_team_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
        CONSTRAINT "fk_team_members_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
      )
    `);

    // 創建 team_credentials 表
    await queryRunner.query(`
      CREATE TABLE "team_credentials" (
        "team_id" uuid NOT NULL,
        "credential_id" uuid NOT NULL,
        "tenant_id" uuid NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "created_by" uuid NOT NULL,
        CONSTRAINT "pk_team_credentials" PRIMARY KEY ("team_id", "credential_id"),
        CONSTRAINT "fk_team_credentials_team" FOREIGN KEY ("team_id") REFERENCES "teams"("id"),
        CONSTRAINT "fk_team_credentials_credential" FOREIGN KEY ("credential_id") REFERENCES "credentials"("id"),
        CONSTRAINT "fk_team_credentials_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
      )
    `);

    // 創建 audit_logs 表
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "action" varchar(50) NOT NULL,
        "table_name" varchar(50) NOT NULL,
        "record_id" uuid NOT NULL,
        "old_data" jsonb,
        "new_data" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_audit_logs_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "fk_audit_logs_user" FOREIGN KEY ("user_id") REFERENCES "users"("id")
      )
    `);

    // 創建索引
    await queryRunner.query(
      `CREATE INDEX "idx_organizations_tenant" ON "organizations"("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_tenant" ON "users"("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_environments_tenant" ON "environments"("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_services_tenant" ON "services"("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_credentials_tenant" ON "credentials"("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_teams_tenant" ON "teams"("tenant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_audit_logs_tenant" ON "audit_logs"("tenant_id")`,
    );

    // 創建複合索引
    await queryRunner.query(
      `CREATE INDEX "idx_users_tenant_email" ON "users"("tenant_id", "email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_services_tenant_status" ON "services"("tenant_id", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_credentials_tenant_type" ON "credentials"("tenant_id", "type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_team_members_user" ON "team_members"("user_id", "tenant_id")`,
    );

    // 啟用 Row Level Security
    await queryRunner.query(
      `ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(`ALTER TABLE "users" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE "environments" ENABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(`ALTER TABLE "services" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE "credentials" ENABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(`ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_credentials" ENABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY`,
    );

    // 創建 RLS 策略
    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON organizations
        USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
    `);
    // ... 對其他表應用相同的策略
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 刪除 RLS 策略
    await queryRunner.query(
      `DROP POLICY tenant_isolation_policy ON organizations`,
    );
    // ... 刪除其他表的策略

    // 刪除索引
    await queryRunner.query(`DROP INDEX "idx_team_members_user"`);
    await queryRunner.query(`DROP INDEX "idx_credentials_tenant_type"`);
    await queryRunner.query(`DROP INDEX "idx_services_tenant_status"`);
    await queryRunner.query(`DROP INDEX "idx_users_tenant_email"`);
    await queryRunner.query(`DROP INDEX "idx_audit_logs_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_teams_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_credentials_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_services_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_environments_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_users_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_organizations_tenant"`);

    // 刪除表
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "team_credentials"`);
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TABLE "credentials"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "environments"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "tenant_admins"`);
    await queryRunner.query(`DROP TABLE "tenants"`);
  }
}
