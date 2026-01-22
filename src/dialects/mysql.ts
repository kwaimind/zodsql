import * as z from "zod/v4";
import { SQLDialect } from "./base";

export class MySQLDialect implements SQLDialect {
  mapString(): string {
    return "VARCHAR(255)";
  }

  mapNumber(): string {
    return "INT";
  }

  mapBoolean(): string {
    return "TINYINT(1)";
  }

  mapDate(): string {
    return "DATETIME";
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
