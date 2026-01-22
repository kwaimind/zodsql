import { z } from "zod";
import {
  SQLDialect,
  PostgresDialect,
  SQLiteDialect,
  MySQLDialect,
} from "./dialects";

type Return = {
  key: string;
  type: string;
  nullable?: boolean;
  optional?: boolean;
};

const unwrapSchema = (
  schema: z.ZodTypeAny,
  nullable = false,
  optional = false,
): { schema: z.ZodTypeAny; nullable: boolean; optional: boolean } => {
  if (schema instanceof z.ZodNullable)
    return unwrapSchema(
      (schema as z.ZodNullable<z.ZodTypeAny>).unwrap(),
      true,
      optional,
    );
  if (schema instanceof z.ZodOptional)
    return unwrapSchema(
      (schema as z.ZodOptional<z.ZodTypeAny>).unwrap(),
      nullable,
      true,
    );
  return { schema, nullable, optional };
};

const getBaseType = (
  schema: z.ZodTypeAny,
  dialect: SQLDialect,
): Return["type"] => {
  if (schema instanceof z.ZodString) return dialect.mapString(schema);
  if (schema instanceof z.ZodNumber) return dialect.mapNumber(schema);
  if (schema instanceof z.ZodBoolean) return dialect.mapBoolean(schema);
  if (schema instanceof z.ZodDate) return dialect.mapDate(schema);
  return dialect.fallbackType();
};

const getType = (
  schema: z.ZodTypeAny,
  dialect: SQLDialect,
): { type: Return["type"]; nullable: boolean; optional: boolean } => {
  const { schema: unwrapped, nullable, optional } = unwrapSchema(schema);
  return { type: getBaseType(unwrapped, dialect), nullable, optional };
};

/**
 *
 * @see https://github.com/colinhacks/zod/discussions/2134#discussioncomment-5194111
 */
const zodKeys = <T extends z.ZodTypeAny>(
  schema: T,
  dialect: SQLDialect,
): Return[] => {
  if (schema === null || schema === undefined) return [];

  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return zodKeys(schema.unwrap() as T, dialect);

  if (schema instanceof z.ZodArray)
    return zodKeys(schema.element as T, dialect);

  if (schema instanceof z.ZodObject) {
    const entries = Object.entries(schema.shape);
    return entries.flatMap(([key, value]) => {
      const nested =
        value instanceof z.ZodType
          ? zodKeys(value as z.ZodTypeAny, dialect).map((subKey) => ({
              key: `${key}.${subKey.key}`,
              type: subKey.type,
              nullable: subKey.nullable,
              optional: subKey.optional,
            }))
          : [];

      if (nested.length) return nested;

      const { type, nullable, optional } = getType(value, dialect);
      return { key, type, nullable, optional };
    });
  }

  return [];
};

const builtInDialects: {
  postgres: PostgresDialect;
  sqlite: SQLiteDialect;
  mysql: MySQLDialect;
} = {
  postgres: new PostgresDialect(),
  sqlite: new SQLiteDialect(),
  mysql: new MySQLDialect(),
};

type DialectName = keyof typeof builtInDialects;

export const convert = (
  schema: z.ZodObject,
  tableName: string,
  dialect: DialectName = "postgres",
): string => {
  if (!(schema instanceof z.ZodObject)) return "";

  const dialectInstance = builtInDialects[dialect];

  const vals = zodKeys(schema, dialectInstance);

  const columns = vals.map(({ key, type, nullable, optional }) => {
    const nullability = dialectInstance.formatNullability(
      nullable ?? true,
      optional ?? true,
    );
    return `${key} ${type}${nullability}`;
  });

  return dialectInstance.createTableStatement(tableName, columns);
};
