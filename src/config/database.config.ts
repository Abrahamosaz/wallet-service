import { Provider } from "@nestjs/common";
import * as Knex from "knex";
import KnexConfig from "../../knexfile";

export const KNEX_CONNECTION = "KNEX_CONNECTION";

export const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: async () => {
    const knex = Knex(KnexConfig.development);

    try {
      await knex.raw("SELECT 1");
      console.log("Database connection established successfully.");
    } catch (error) {
      console.error("Failed to establish database connection:", error);
      throw error;
    }

    return knex;
  },
};
