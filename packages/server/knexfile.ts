import type { Knex } from 'knex';

// Update with your config settings.

const config = {
  client: 'mysql',
  connection: {
    database: 'financeiro',
    user: 'financeiroapp',
    password: 'f@test',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/infra/database/migrations',
    tableName: 'knex_migrations',
  },
} as Knex.Config;

export default config;
