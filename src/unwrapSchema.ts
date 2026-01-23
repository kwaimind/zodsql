import * as z from 'zod/v4';

export const unwrapSchema = (
  schema: z.ZodType,
  nullable = false,
  optional = false,
): { schema: z.ZodType; nullable: boolean; optional: boolean } => {
  if (schema instanceof z.ZodNullable)
    return unwrapSchema(
      (schema as z.ZodNullable<z.ZodType>).unwrap(),
      true,
      optional,
    );
  if (schema instanceof z.ZodOptional)
    return unwrapSchema(
      (schema as z.ZodOptional<z.ZodType>).unwrap(),
      nullable,
      true,
    );
  return { schema, nullable, optional };
};
