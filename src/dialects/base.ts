import * as z from "zod/v4";

export interface SQLDialect {
  /**
   * Map a Zod string schema to SQL type
   */
  mapString(schema: z.ZodString): string;

  /**
   * Map a Zod number schema to SQL type
   */
  mapNumber(schema: z.ZodNumber): string;

  /**
   * Map a Zod boolean schema to SQL type
   */
  mapBoolean(schema: z.ZodBoolean): string;

  /**
   * Map a Zod date schema to SQL type
   */
  mapDate(schema: z.ZodDate): string;

  /**
   * Fallback type for unmapped schemas
   */
  fallbackType(): string;

  /**
   * Format the nullability constraint for a column
   */
  formatNullability(nullable: boolean, optional: boolean): string;

  /**
   * Generate the full CREATE TABLE statement
   */
  createTableStatement(tableName: string, columns: string[]): string;
}
