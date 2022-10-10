import { Knex } from 'knex';
import { TABLE_USERS, TABLE_VARIABLE_GAINS } from '../../names';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_VARIABLE_GAINS, (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.boolean('received').defaultTo(false);
    table.date('at').notNullable();
    table.double('value').notNullable();
    table.string('userId').references('id').inTable(TABLE_USERS);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_VARIABLE_GAINS);
}
