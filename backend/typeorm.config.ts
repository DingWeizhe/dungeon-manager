import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'system_manager',
  schema: process.env.DB_SCHEMA || 'public',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
