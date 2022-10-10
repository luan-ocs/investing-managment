import { Knex } from 'knex';
import { TABLE_FIXED_GAINS, TABLE_USERS } from '../../names';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_FIXED_GAINS, (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.date('since').notNullable();
    table.date('until');
    table.double('value').notNullable();
    table.string('userId').references('id').inTable(TABLE_USERS);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_FIXED_GAINS);
}
