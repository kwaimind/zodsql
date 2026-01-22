import * as z from "zod/v4";
import { SQLDialect } from "./base";

export class PostgresDialect implements SQLDialect {
  mapString(_schema: z.ZodString): string {
    return "VARCHAR(255)";
  }

  mapNumber(_schema: z.ZodNumber): string {
    return "INTEGER";
  }

  mapBoolean(_schema: z.ZodBoolean): string {
    return "BOOLEAN";
  }

  mapDate(_schema: z.ZodDate): string {
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
