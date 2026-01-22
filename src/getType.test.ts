import { describe, it, expect } from "vitest";
import { getType } from "./getType";
import * as z from "zod/v4";
import { dialects } from "./dialects";

describe("getType", () => {
  describe("basic types with postgres", () => {
    it("returns type for string schema", () => {
      const result = getType(z.string(), dialects.postgres);

      expect(result).toEqual({
        type: "VARCHAR(255)",
        nullable: false,
        optional: false,
      });
    });

    it("returns type for number schema", () => {
      const result = getType(z.number(), dialects.postgres);

      expect(result).toEqual({
        type: "INTEGER",
        nullable: false,
        optional: false,
      });
    });

    it("returns type for boolean schema", () => {
      const result = getType(z.boolean(), dialects.postgres);

      expect(result).toEqual({
        type: "BOOLEAN",
        nullable: false,
        optional: false,
      });
    });

    it("returns type for date schema", () => {
      const result = getType(z.date(), dialects.postgres);

      expect(result).toEqual({
        type: "TIMESTAMP",
        nullable: false,
        optional: false,
      });
    });
  });

  describe("nullable schemas", () => {
    it("marks nullable string as nullable", () => {
      const result = getType(z.string().nullable(), dialects.postgres);

      expect(result).toEqual({
        type: "VARCHAR(255)",
        nullable: true,
        optional: false,
      });
    });

    it("marks nullable number as nullable", () => {
      const result = getType(z.number().nullable(), dialects.postgres);

      expect(result).toEqual({
        type: "INTEGER",
        nullable: true,
        optional: false,
      });
    });
  });

  describe("optional schemas", () => {
    it("marks optional string as optional", () => {
      const result = getType(z.string().optional(), dialects.postgres);

      expect(result).toEqual({
        type: "VARCHAR(255)",
        nullable: false,
        optional: true,
      });
    });

    it("marks optional number as optional", () => {
      const result = getType(z.number().optional(), dialects.postgres);

      expect(result).toEqual({
        type: "INTEGER",
        nullable: false,
        optional: true,
      });
    });
  });

  describe("nullable and optional schemas", () => {
    it("marks nullable optional string", () => {
      const result = getType(
        z.string().nullable().optional(),
        dialects.postgres,
      );

      expect(result).toEqual({
        type: "VARCHAR(255)",
        nullable: true,
        optional: true,
      });
    });

    it("marks optional nullable string", () => {
      const result = getType(
        z.string().optional().nullable(),
        dialects.postgres,
      );

      expect(result).toEqual({
        type: "VARCHAR(255)",
        nullable: true,
        optional: true,
      });
    });
  });

  describe("different dialects", () => {
    it("uses mysql types", () => {
      const result = getType(z.boolean(), dialects.mysql);

      expect(result).toEqual({
        type: "TINYINT(1)",
        nullable: false,
        optional: false,
      });
    });

    it("uses sqlite types", () => {
      const result = getType(z.string(), dialects.sqlite);

      expect(result).toEqual({
        type: "TEXT",
        nullable: false,
        optional: false,
      });
    });
  });

  describe("fallback types", () => {
    it("uses fallback for array types", () => {
      const result = getType(z.array(z.string()), dialects.postgres);

      expect(result).toEqual({
        type: "TEXT",
        nullable: false,
        optional: false,
      });
    });

    it("uses fallback for object types", () => {
      const result = getType(z.object({ name: z.string() }), dialects.postgres);

      expect(result).toEqual({
        type: "TEXT",
        nullable: false,
        optional: false,
      });
    });
  });
});
