import { Knex } from 'knex';
import { TABLE_USERS } from '../../names';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_USERS, (table) => {
    table.string('name').notNullable();
    table.string('email').unique();
    table.string('id').primary();
    table.string('password').notNullable();
    table.date('createdAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_USERS);
}
