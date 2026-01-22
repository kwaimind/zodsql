import * as z from "zod/v4";
import { SQLDialect } from "./base";

export class PostgresDialect implements SQLDialect {
  mapString(): string {
    return "VARCHAR(255)";
  }

  mapNumber(): string {
    return "INTEGER";
  }

  mapBoolean(): string {
    return "BOOLEAN";
  }

  mapDate(): string {
    return "TIMESTAMP";
  }

  fallbackType(): string {
    return "VARCHAR(255)";
  }

  formatNullability(nullable: boolean, optional: boolean): string {
    return nullable || optional ? "" : " NOT NULL";
  }

  createTableStatement(tableName: string, columns: string[]): string {
    return `CREATE TABLE ${tableName} (${columns.join(", ")});`;
  }
}
