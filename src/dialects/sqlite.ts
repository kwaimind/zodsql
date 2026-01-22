import * as z from "zod/v4";
import { SQLDialect } from "./base";

export class SQLiteDialect implements SQLDialect {
  mapString(): string {
    return "TEXT";
  }

  mapNumber(): string {
    return "INTEGER";
  }

  mapBoolean(): string {
    return "INTEGER";
  }

  mapDate(): string {
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
