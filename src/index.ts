import * as z from 'zod/v4';
import { type DialectName, dialects } from './dialects';
import { zodKeys } from './zodKeys';

export const convert = <T extends z.ZodType>(
  schema: T,
  tableName: string,
  dialect: DialectName = 'postgres',
): string => {
  if (!(schema instanceof z.ZodObject)) return '';

  const dialectInstance = dialects[dialect];

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
