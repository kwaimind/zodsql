export interface SQLDialect {
  /**
   * Map a Zod string schema to SQL type
   */
  mapString(): string;

  /**
   * Map a Zod number schema to SQL type
   */
  mapNumber(): string;

  /**
   * Map a Zod boolean schema to SQL type
   */
  mapBoolean(): string;

  /**
   * Map a Zod date schema to SQL type
   */
  mapDate(): string;

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
