import { describe, expect, it } from 'vitest';
import * as z from 'zod/v4';
import { dialects } from './dialects';
import { zodKeys } from './zodKeys';

describe('zodKeys', () => {
  describe('basic object schemas', () => {
    it('extracts keys from simple object', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
          {
            "key": "age",
            "nullable": false,
            "optional": false,
            "type": "INTEGER",
          },
        ]
      `);
    });

    it('extracts keys with all primitive types', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        active: z.boolean(),
        createdAt: z.date(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
          {
            "key": "age",
            "nullable": false,
            "optional": false,
            "type": "INTEGER",
          },
          {
            "key": "active",
            "nullable": false,
            "optional": false,
            "type": "BOOLEAN",
          },
          {
            "key": "createdAt",
            "nullable": false,
            "optional": false,
            "type": "TIMESTAMP",
          },
        ]
      `);
    });
  });

  describe('nullable and optional fields', () => {
    it('handles nullable fields', () => {
      const schema = z.object({
        name: z.string().nullable(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": true,
            "optional": false,
            "type": "VARCHAR(255)",
          },
        ]
      `);
    });

    it('handles optional fields', () => {
      const schema = z.object({
        name: z.string().optional(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": false,
            "optional": true,
            "type": "VARCHAR(255)",
          },
        ]
      `);
    });

    it('handles nullable optional fields', () => {
      const schema = z.object({
        name: z.string().nullable().optional(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": true,
            "optional": true,
            "type": "VARCHAR(255)",
          },
        ]
      `);
    });
  });

  describe('nested objects', () => {
    it('flattens nested objects with dot notation', () => {
      const schema = z.object({
        name: z.string(),
        address: z.object({
          street: z.string(),
          city: z.string(),
        }),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
          {
            "key": "address_street",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
          {
            "key": "address_city",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
        ]
      `);
    });

    it('flattens deeply nested objects', () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            email: z.string(),
            age: z.number(),
          }),
        }),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "user_profile_email",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
          {
            "key": "user_profile_age",
            "nullable": false,
            "optional": false,
            "type": "INTEGER",
          },
        ]
      `);
    });

    it('handles nullable nested objects', () => {
      const schema = z.object({
        address: z
          .object({
            street: z.string(),
          })
          .nullable(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "address_street",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
        ]
      `);
    });

    it('handles optional nested objects', () => {
      const schema = z.object({
        address: z
          .object({
            street: z.string(),
          })
          .optional(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "address_street",
            "nullable": false,
            "optional": false,
            "type": "VARCHAR(255)",
          },
        ]
      `);
    });
  });

  describe('arrays', () => {
    it('extracts element schema from array', () => {
      const schema = z.object({
        tags: z.array(z.string()),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('handles nested arrays', () => {
      const schema = z.object({
        items: z.array(
          z.object({
            name: z.string(),
          }),
        ),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`[]`);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for null schema', () => {
      const result = zodKeys(null as any, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('returns empty array for undefined schema', () => {
      const result = zodKeys(undefined as any, dialects.postgres);

      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('returns empty array for non-object schema', () => {
      const result = zodKeys(z.string(), dialects.postgres);

      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('returns empty array for array schema', () => {
      const result = zodKeys(z.array(z.string()), dialects.postgres);

      expect(result).toMatchInlineSnapshot(`[]`);
    });
  });

  describe('different dialects', () => {
    it('uses mysql types', () => {
      const schema = z.object({
        active: z.boolean(),
      });

      const result = zodKeys(schema, dialects.mysql);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "active",
            "nullable": false,
            "optional": false,
            "type": "TINYINT(1)",
          },
        ]
      `);
    });

    it('uses sqlite types', () => {
      const schema = z.object({
        name: z.string(),
        active: z.boolean(),
      });

      const result = zodKeys(schema, dialects.sqlite);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "key": "name",
            "nullable": false,
            "optional": false,
            "type": "TEXT",
          },
          {
            "key": "active",
            "nullable": false,
            "optional": false,
            "type": "INTEGER",
          },
        ]
      `);
    });
  });
});
