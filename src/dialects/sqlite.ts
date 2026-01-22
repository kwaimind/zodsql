import { z } from "zod";
import { SQLDialect } from "./base";

export class SQLiteDialect implements SQLDialect {
  mapString(_schema: z.ZodString): string {
    return "TEXT";
  }

  mapNumber(_schema: z.ZodNumber): string {
    return "INTEGER";
  }

  mapBoolean(_schema: z.ZodBoolean): string {
    return "INTEGER";
  }

  mapDate(_schema: z.ZodDate): string {
    return "TEXT";
  }

  fallbackType(): string {
    return "TEXT";
  }

  formatNullability(nullable: boolean, optional: boolean): string {
    return nullable || optional ? "" : " NOT NULL";
  }

  createTableStatement(tableName: string, columns: string[]): string {
    return `CREATE TABLE ${tableName} (${columns.join(", ")});`;
  }
}
