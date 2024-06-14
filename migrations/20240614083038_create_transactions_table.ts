import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table
      .integer("wallet_id")
      .unsigned()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table
      .enum("transaction_type", ["fund", "transfer", "withdraw"])
      .notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.enum("currency_type", ["naira", "dollar"]);
    table
      .integer("to_wallet_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("wallets"); // For transfer
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
