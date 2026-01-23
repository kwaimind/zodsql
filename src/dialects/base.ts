export interface SQLDialect {
  mapString(): string;

  mapNumber(): string;

  mapBoolean(): string;

  mapDate(): string;

  mapBigInt(): string;

  fallbackType(): string;

  formatNullability(nullable: boolean, optional: boolean): string;

  createTableStatement(tableName: string, columns: string[]): string;
}
