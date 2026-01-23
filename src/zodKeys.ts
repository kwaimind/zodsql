import * as z from 'zod/v4';
import type { SQLDialect } from './dialects';
import { getType } from './getType';
import type { Return } from './types';

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

  if (schema instanceof z.ZodArray) return [];

  if (schema instanceof z.ZodObject) {
    const entries = Object.entries(schema.shape);
    return entries.flatMap(([key, value]) => {
      if (!(value instanceof z.ZodType)) return [];

      // Check if this is a nested object or array
      const unwrapped =
        value instanceof z.ZodNullable || value instanceof z.ZodOptional
          ? value.unwrap()
          : value;

      // Skip arrays entirely
      if (unwrapped instanceof z.ZodArray) return [];

      // Handle nested objects
      if (unwrapped instanceof z.ZodObject) {
        const nested = zodKeys(value as z.ZodType, dialect).map((subKey) => ({
          key: `${key}_${subKey.key}`,
          type: subKey.type,
          nullable: subKey.nullable,
          optional: subKey.optional,
        }));
        return nested;
      }

      // Handle primitive types
      const { type, nullable, optional } = getType(value, dialect);
      return { key, type, nullable, optional };
    });
  }

  return [];
};
