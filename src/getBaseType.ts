import * as z from 'zod/v4';
import type { SQLDialect } from './dialects';
import type { Return } from './types';

export const getBaseType = (
  schema: z.ZodType,
  dialect: SQLDialect,
): Return['type'] => {
  if (schema instanceof z.ZodString) return dialect.mapString();
  if (schema instanceof z.ZodNumber) return dialect.mapNumber();
  if (schema instanceof z.ZodBoolean) return dialect.mapBoolean();
  if (schema instanceof z.ZodDate) return dialect.mapDate();
  if (schema instanceof z.ZodBigInt) return dialect.mapBigInt();
  return dialect.fallbackType();
};
