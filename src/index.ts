import { z } from "zod";

type Return = {
  key: string;
  type: "VARCHAR(255)" | "INT" | "BOOLEAN" | "DATETIME";
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

const getBaseType = (schema: z.ZodTypeAny): Return["type"] => {
  if (schema instanceof z.ZodString) return "VARCHAR(255)";
  if (schema instanceof z.ZodNumber) return "INT";
  if (schema instanceof z.ZodBoolean) return "BOOLEAN";
  if (schema instanceof z.ZodDate) return "DATETIME";
  return "VARCHAR(255)";
};

const getType = (
  schema: z.ZodTypeAny,
): { type: Return["type"]; nullable: boolean; optional: boolean } => {
  const { schema: unwrapped, nullable, optional } = unwrapSchema(schema);
  return { type: getBaseType(unwrapped), nullable, optional };
};

/**
 *
 * @see https://github.com/colinhacks/zod/discussions/2134#discussioncomment-5194111
 */
const zodKeys = <T extends z.ZodTypeAny>(schema: T): Return[] => {
  if (schema === null || schema === undefined) return [];

  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return zodKeys(schema.unwrap() as T);

  if (schema instanceof z.ZodArray) return zodKeys(schema.element as T);

  if (schema instanceof z.ZodObject) {
    const entries = Object.entries(schema.shape);
    return entries.flatMap(([key, value]) => {
      const nested =
        value instanceof z.ZodType
          ? zodKeys(value as z.ZodTypeAny).map((subKey) => ({
              key: `${key}.${subKey.key}`,
              type: subKey.type,
              nullable: subKey.nullable,
              optional: subKey.optional,
            }))
          : [];

      if (nested.length) return nested;

      const { type, nullable, optional } = getType(value);
      return { key, type, nullable, optional };
    });
  }

  return [];
};

export const convert = (schema: z.ZodObject, tableName: string) => {
  if (!(schema instanceof z.ZodObject)) return "";

  const vals = zodKeys(schema);

  return `CREATE TABLE ${tableName} (${vals
    .map(({ key, type, nullable, optional }) => {
      const nullability = nullable || optional ? "" : " NOT NULL";
      return `${key} ${type}${nullability}`;
    })
    .join(", ")});`;
};
