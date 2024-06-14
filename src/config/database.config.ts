import { Provider } from "@nestjs/common";
import * as Knex from "knex";
import KnexConfig from "../../knexfile";

export const KNEX_CONNECTION = "KNEX_CONNECTION";

export const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: async () => {
    const knex = Knex(KnexConfig.development);
    return knex;
  },
};
