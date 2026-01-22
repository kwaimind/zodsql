import * as z from "zod/v4";
import { SQLDialect } from "./dialects";
import { Return } from "./types";
import { getType } from "./getType";

/**
 *
 * @see https://github.com/colinhacks/zod/discussions/2134#discussioncomment-5194111
 */
export const zodKeys = <T extends z.ZodType>(
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
          ? zodKeys(value as z.ZodType, dialect).map((subKey) => ({
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
