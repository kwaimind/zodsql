import { describe, it, expect } from "vitest";
import { unwrapSchema } from "./unwrapSchema";
import * as z from "zod/v4";

describe("unwrapSchema", () => {
  it("returns base schema without wrapping", () => {
    const schema = z.string();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(schema);
    expect(result.nullable).toBe(false);
    expect(result.optional).toBe(false);
  });

  it("unwraps nullable schema", () => {
    const baseSchema = z.string();
    const schema = baseSchema.nullable();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(true);
    expect(result.optional).toBe(false);
  });

  it("unwraps optional schema", () => {
    const baseSchema = z.string();
    const schema = baseSchema.optional();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(false);
    expect(result.optional).toBe(true);
  });

  it("unwraps nullable optional schema", () => {
    const baseSchema = z.string();
    const schema = baseSchema.nullable().optional();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(true);
    expect(result.optional).toBe(true);
  });

  it("unwraps optional nullable schema", () => {
    const baseSchema = z.string();
    const schema = baseSchema.optional().nullable();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(true);
    expect(result.optional).toBe(true);
  });

  it("unwraps multiple layers of nullable", () => {
    const baseSchema = z.string();
    const schema = baseSchema.nullable().nullable();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(true);
    expect(result.optional).toBe(false);
  });

  it("unwraps multiple layers of optional", () => {
    const baseSchema = z.string();
    const schema = baseSchema.optional().optional();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(false);
    expect(result.optional).toBe(true);
  });

  it("handles complex schemas", () => {
    const baseSchema = z.object({ name: z.string() });
    const schema = baseSchema.nullable().optional();
    const result = unwrapSchema(schema);

    expect(result.schema).toBe(baseSchema);
    expect(result.nullable).toBe(true);
    expect(result.optional).toBe(true);
  });

  it("handles number schema", () => {
    const schema = z.number().nullable();
    const result = unwrapSchema(schema);

    expect(result.schema).toBeInstanceOf(z.ZodNumber);
    expect(result.nullable).toBe(true);
    expect(result.optional).toBe(false);
  });

  it("handles boolean schema", () => {
    const schema = z.boolean().optional();
    const result = unwrapSchema(schema);

    expect(result.schema).toBeInstanceOf(z.ZodBoolean);
    expect(result.nullable).toBe(false);
    expect(result.optional).toBe(true);
  });
});
