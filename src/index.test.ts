import { describe, it, expect } from "vitest";
import { convert } from "./index";
import z from "zod";

describe("convert", () => {
  it("converts simple string schema", () => {
    const schema = z.object({
      name: z.string(),
    });

    const result = convert(schema, "users");

    expect(result).toMatchInlineSnapshot(
      `"CREATE TABLE users (name VARCHAR(255) NOT NULL);"`,
    );
  });

  it("converts multiple primitive types", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
      createdAt: z.date(),
    });

    const result = convert(schema, "users");

    expect(result).toMatchInlineSnapshot(
      `"CREATE TABLE users (name VARCHAR(255) NOT NULL, age INTEGER NOT NULL, active BOOLEAN NOT NULL, createdAt TIMESTAMP NOT NULL);"`,
    );
  });

  it("converts nested objects with dot notation", () => {
    const schema = z.object({
      name: z.string(),
      address: z.object({
        street: z.string(),
        city: z.string(),
      }),
    });

    const result = convert(schema, "users");

    expect(result).toMatchInlineSnapshot(
      `"CREATE TABLE users (name VARCHAR(255) NOT NULL, address.street VARCHAR(255) NOT NULL, address.city VARCHAR(255) NOT NULL);"`,
    );
  });

  it("handles optional fields", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().optional(),
    });

    const result = convert(schema, "users");

    expect(result).toMatchInlineSnapshot(
      `"CREATE TABLE users (name VARCHAR(255) NOT NULL, age INTEGER);"`,
    );
  });

  it("handles nullable fields", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().nullable(),
    });

    const result = convert(schema, "users");

    expect(result).toMatchInlineSnapshot(
      `"CREATE TABLE users (name VARCHAR(255) NOT NULL, age INTEGER);"`,
    );
  });

  it("returns empty string for non-object schemas", () => {
    const schema = z.string();

    const result = convert(schema as any, "users");

    expect(result).toBe("");
  });

  it.skip("handles deeply nested objects", () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          email: z.string(),
          age: z.number(),
        }),
      }),
    });

    const result = convert(schema, "data");

    expect(result).toBe(
      "CREATE TABLE data (user.profile.email varchar(255), user.profile.age number);",
    );
  });

  it.skip("handles mixed types in complex schema", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      isActive: z.boolean(),
      lastLogin: z.date(),
      settings: z.object({
        theme: z.string(),
        notifications: z.boolean(),
      }),
    });

    const result = convert(schema, "users");

    expect(result).toBe(
      "CREATE TABLE users (id number, name varchar(255), isActive boolean, lastLogin date, settings.theme varchar(255), settings.notifications boolean);",
    );
  });

  describe("dialect support", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
      createdAt: z.date(),
    });

    it("uses postgres dialect by default", () => {
      const result = convert(schema, "users");

      expect(result).toMatchInlineSnapshot(
        `"CREATE TABLE users (name VARCHAR(255) NOT NULL, age INTEGER NOT NULL, active BOOLEAN NOT NULL, createdAt TIMESTAMP NOT NULL);"`,
      );
    });

    it("uses postgres dialect when specified", () => {
      const result = convert(schema, "users", "postgres");

      expect(result).toMatchInlineSnapshot(
        `"CREATE TABLE users (name VARCHAR(255) NOT NULL, age INTEGER NOT NULL, active BOOLEAN NOT NULL, createdAt TIMESTAMP NOT NULL);"`,
      );
    });

    it("uses sqlite dialect", () => {
      const result = convert(schema, "users", "sqlite");

      expect(result).toMatchInlineSnapshot(
        `"CREATE TABLE users (name TEXT NOT NULL, age INTEGER NOT NULL, active INTEGER NOT NULL, createdAt TEXT NOT NULL);"`,
      );
    });

    it("uses mysql dialect", () => {
      const result = convert(schema, "users", "mysql");

      expect(result).toMatchInlineSnapshot(
        `"CREATE TABLE users (name VARCHAR(255) NOT NULL, age INT NOT NULL, active TINYINT(1) NOT NULL, createdAt DATETIME NOT NULL);"`,
      );
    });
  });
});
