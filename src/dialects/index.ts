import { MySQLDialect } from "./mysql";
import { PostgresDialect } from "./postgres";
import { SQLiteDialect } from "./sqlite";

export const dialects: {
  postgres: PostgresDialect;
  sqlite: SQLiteDialect;
  mysql: MySQLDialect;
} = {
  postgres: new PostgresDialect(),
  sqlite: new SQLiteDialect(),
  mysql: new MySQLDialect(),
};

export type DialectName = keyof typeof dialects;
