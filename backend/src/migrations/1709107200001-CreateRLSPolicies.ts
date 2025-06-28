import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRLSPolicies1709107200001 implements MigrationInterface {
  name = 'CreateRLSPolicies1709107200001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 創建 RLS 策略函數
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION check_tenant_access()
      RETURNS boolean AS $$
      BEGIN
        RETURN current_setting('app.current_tenant_id')::uuid = tenant_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 為每個表創建 RLS 策略
    const tables = [
      'organizations',
      'users',
      'environments',
      'services',
      'credentials',
      'teams',
      'team_members',
      'team_credentials',
      'audit_logs',
    ];

    for (const table of tables) {
      // 創建 SELECT 策略
      await queryRunner.query(`
        CREATE POLICY ${table}_select_policy ON ${table}
          FOR SELECT
          USING (check_tenant_access())
      `);

      // 創建 INSERT 策略
      await queryRunner.query(`
        CREATE POLICY ${table}_insert_policy ON ${table}
          FOR INSERT
          WITH CHECK (check_tenant_access())
      `);

      // 創建 UPDATE 策略
      await queryRunner.query(`
        CREATE POLICY ${table}_update_policy ON ${table}
          FOR UPDATE
          USING (check_tenant_access())
          WITH CHECK (check_tenant_access())
      `);

      // 創建 DELETE 策略
      await queryRunner.query(`
        CREATE POLICY ${table}_delete_policy ON ${table}
          FOR DELETE
          USING (check_tenant_access())
      `);
    }

    // 創建自動設置租戶 ID 的觸發器函數
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_tenant_id()
      RETURNS trigger AS $$
      BEGIN
        NEW.tenant_id = current_setting('app.current_tenant_id')::uuid;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 創建自動設置更新時間的觸發器函數
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS trigger AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 為每個表創建觸發器
    for (const table of tables) {
      // 創建設置租戶 ID 的觸發器
      await queryRunner.query(`
        CREATE TRIGGER set_tenant_id_trigger
        BEFORE INSERT ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION set_tenant_id();
      `);

      // 創建更新時間的觸發器
      await queryRunner.query(`
        CREATE TRIGGER update_updated_at_trigger
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
      `);
    }

    // 創建審計日誌觸發器函數
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION audit_trigger_func()
      RETURNS trigger AS $$
      DECLARE
        audit_data jsonb;
      BEGIN
        IF TG_OP = 'DELETE' THEN
          audit_data = to_jsonb(OLD);
          INSERT INTO audit_logs (
            tenant_id,
            user_id,
            action,
            table_name,
            record_id,
            old_data
          ) VALUES (
            OLD.tenant_id,
            current_setting('app.current_user_id')::uuid,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            audit_data
          );
          RETURN OLD;
        ELSIF TG_OP = 'UPDATE' THEN
          audit_data = jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
          );
          INSERT INTO audit_logs (
            tenant_id,
            user_id,
            action,
            table_name,
            record_id,
            old_data,
            new_data
          ) VALUES (
            NEW.tenant_id,
            current_setting('app.current_user_id')::uuid,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
          );
          RETURN NEW;
        ELSIF TG_OP = 'INSERT' THEN
          audit_data = to_jsonb(NEW);
          INSERT INTO audit_logs (
            tenant_id,
            user_id,
            action,
            table_name,
            record_id,
            new_data
          ) VALUES (
            NEW.tenant_id,
            current_setting('app.current_user_id')::uuid,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            audit_data
          );
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 為每個主要表創建審計觸發器
    const auditTables = [
      'organizations',
      'users',
      'environments',
      'services',
      'credentials',
      'teams',
    ];

    for (const table of auditTables) {
      await queryRunner.query(`
        CREATE TRIGGER audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_func();
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'organizations',
      'users',
      'environments',
      'services',
      'credentials',
      'teams',
      'team_members',
      'team_credentials',
      'audit_logs',
    ];

    // 刪除審計觸發器
    const auditTables = [
      'organizations',
      'users',
      'environments',
      'services',
      'credentials',
      'teams',
    ];

    for (const table of auditTables) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS audit_trigger ON ${table}`,
      );
    }

    // 刪除觸發器和策略
    for (const table of tables) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS update_updated_at_trigger ON ${table}`,
      );
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS set_tenant_id_trigger ON ${table}`,
      );
      await queryRunner.query(
        `DROP POLICY IF EXISTS ${table}_delete_policy ON ${table}`,
      );
      await queryRunner.query(
        `DROP POLICY IF EXISTS ${table}_update_policy ON ${table}`,
      );
      await queryRunner.query(
        `DROP POLICY IF EXISTS ${table}_insert_policy ON ${table}`,
      );
      await queryRunner.query(
        `DROP POLICY IF EXISTS ${table}_select_policy ON ${table}`,
      );
    }

    // 刪除函數
    await queryRunner.query('DROP FUNCTION IF EXISTS audit_trigger_func()');
    await queryRunner.query('DROP FUNCTION IF EXISTS update_updated_at()');
    await queryRunner.query('DROP FUNCTION IF EXISTS set_tenant_id()');
    await queryRunner.query('DROP FUNCTION IF EXISTS check_tenant_access()');
  }
}
