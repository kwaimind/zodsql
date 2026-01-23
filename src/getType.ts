import type * as z from 'zod/v4';
import type { SQLDialect } from './dialects';
import { getBaseType } from './getBaseType';
import type { Return } from './types';
import { unwrapSchema } from './unwrapSchema';

export const getType = (
  schema: z.ZodType,
  dialect: SQLDialect,
): { type: Return['type']; nullable: boolean; optional: boolean } => {
  const { schema: unwrapped, nullable, optional } = unwrapSchema(schema);
  return { type: getBaseType(unwrapped, dialect), nullable, optional };
};
