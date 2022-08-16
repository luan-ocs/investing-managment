import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.string('name').notNullable();
    table.string('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
