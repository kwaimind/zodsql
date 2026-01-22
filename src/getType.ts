import * as z from "zod/v4";
import { SQLDialect } from "./dialects";
import { getBaseType } from "./getBaseType";
import { unwrapSchema } from "./unwrapSchema";
import { Return } from "./types";

export const getType = (
  schema: z.ZodType,
  dialect: SQLDialect,
): { type: Return["type"]; nullable: boolean; optional: boolean } => {
  const { schema: unwrapped, nullable, optional } = unwrapSchema(schema);
  return { type: getBaseType(unwrapped, dialect), nullable, optional };
};
