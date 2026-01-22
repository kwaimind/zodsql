import { describe, it, expect } from "vitest";
import { zodKeys } from "./zodKeys";
import * as z from "zod/v4";
import { dialects } from "./dialects";

describe("zodKeys", () => {
  describe("basic object schemas", () => {
    it("extracts keys from simple object", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        { key: "name", type: "VARCHAR(255)", nullable: false, optional: false },
        { key: "age", type: "INTEGER", nullable: false, optional: false },
      ]);
    });

    it("extracts keys with all primitive types", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        active: z.boolean(),
        createdAt: z.date(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        { key: "name", type: "VARCHAR(255)", nullable: false, optional: false },
        { key: "age", type: "INTEGER", nullable: false, optional: false },
        { key: "active", type: "BOOLEAN", nullable: false, optional: false },
        {
          key: "createdAt",
          type: "TIMESTAMP",
          nullable: false,
          optional: false,
        },
      ]);
    });
  });

  describe("nullable and optional fields", () => {
    it("handles nullable fields", () => {
      const schema = z.object({
        name: z.string().nullable(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        { key: "name", type: "VARCHAR(255)", nullable: true, optional: false },
      ]);
    });

    it("handles optional fields", () => {
      const schema = z.object({
        name: z.string().optional(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        { key: "name", type: "VARCHAR(255)", nullable: false, optional: true },
      ]);
    });

    it("handles nullable optional fields", () => {
      const schema = z.object({
        name: z.string().nullable().optional(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        { key: "name", type: "VARCHAR(255)", nullable: true, optional: true },
      ]);
    });
  });

  describe("nested objects", () => {
    it("flattens nested objects with dot notation", () => {
      const schema = z.object({
        name: z.string(),
        address: z.object({
          street: z.string(),
          city: z.string(),
        }),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        { key: "name", type: "VARCHAR(255)", nullable: false, optional: false },
        {
          key: "address.street",
          type: "VARCHAR(255)",
          nullable: false,
          optional: false,
        },
        {
          key: "address.city",
          type: "VARCHAR(255)",
          nullable: false,
          optional: false,
        },
      ]);
    });

    it("flattens deeply nested objects", () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            email: z.string(),
            age: z.number(),
          }),
        }),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        {
          key: "user.profile.email",
          type: "VARCHAR(255)",
          nullable: false,
          optional: false,
        },
        {
          key: "user.profile.age",
          type: "INTEGER",
          nullable: false,
          optional: false,
        },
      ]);
    });

    it("handles nullable nested objects", () => {
      const schema = z.object({
        address: z
          .object({
            street: z.string(),
          })
          .nullable(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        {
          key: "address.street",
          type: "VARCHAR(255)",
          nullable: false,
          optional: false,
        },
      ]);
    });

    it("handles optional nested objects", () => {
      const schema = z.object({
        address: z
          .object({
            street: z.string(),
          })
          .optional(),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([
        {
          key: "address.street",
          type: "VARCHAR(255)",
          nullable: false,
          optional: false,
        },
      ]);
    });
  });

  describe("arrays", () => {
    it("extracts element schema from array", () => {
      const schema = z.object({
        tags: z.array(z.string()),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([]);
    });

    it("handles nested arrays", () => {
      const schema = z.object({
        items: z.array(
          z.object({
            name: z.string(),
          }),
        ),
      });

      const result = zodKeys(schema, dialects.postgres);

      expect(result).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("returns empty array for null schema", () => {
      const result = zodKeys(null as any, dialects.postgres);

      expect(result).toEqual([]);
    });

    it("returns empty array for undefined schema", () => {
      const result = zodKeys(undefined as any, dialects.postgres);

      expect(result).toEqual([]);
    });

    it("returns empty array for non-object schema", () => {
      const result = zodKeys(z.string(), dialects.postgres);

      expect(result).toEqual([]);
    });

    it("returns empty array for array schema", () => {
      const result = zodKeys(z.array(z.string()), dialects.postgres);

      expect(result).toEqual([]);
    });
  });

  describe("different dialects", () => {
    it("uses mysql types", () => {
      const schema = z.object({
        active: z.boolean(),
      });

      const result = zodKeys(schema, dialects.mysql);

      expect(result).toEqual([
        { key: "active", type: "TINYINT(1)", nullable: false, optional: false },
      ]);
    });

    it("uses sqlite types", () => {
      const schema = z.object({
        name: z.string(),
        active: z.boolean(),
      });

      const result = zodKeys(schema, dialects.sqlite);

      expect(result).toEqual([
        { key: "name", type: "TEXT", nullable: false, optional: false },
        { key: "active", type: "INTEGER", nullable: false, optional: false },
      ]);
    });
  });
});
