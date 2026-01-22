import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { convert } from "./index";
import * as z from "zod/v4";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Client } from "pg";

describe("SQL validation integration tests", () => {
  let container: StartedPostgreSqlContainer;
  let client: Client;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();
    client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });
    await client.connect();
  }, 60000);

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  it("validates simple schema SQL syntax", async () => {
    const schema = z.object({
      name: z.string(),
    });

    const sql = convert(schema, "users");

    await expect(client.query(sql)).resolves.toBeTruthy();
  });

  it("validates multiple primitive types SQL", async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
      createdAt: z.date(),
    });

    const sql = convert(schema, "products");

    await expect(client.query(sql)).resolves.toBeTruthy();
  });

  it.skip("validates nested objects with dot notation", async () => {
    const schema = z.object({
      name: z.string(),
      address: z.object({
        street: z.string(),
        city: z.string(),
      }),
    });

    const sql = convert(schema, "locations");

    await expect(client.query(sql)).resolves.toBeTruthy();
  });

  it("validates optional fields SQL", async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().optional(),
    });

    const sql = convert(schema, "members");

    await expect(client.query(sql)).resolves.toBeTruthy();
  });

  it("validates nullable fields SQL", async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().nullable(),
    });

    const sql = convert(schema, "accounts");

    await expect(client.query(sql)).resolves.toBeTruthy();
  });

  it.skip("validates complex nested schema", async () => {
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

    const sql = convert(schema, "user_profiles");

    await expect(client.query(sql)).resolves.toBeTruthy();
  });

  it("validates that data can be inserted into created table", async () => {
    const schema = z.object({
      email: z.string(),
      verified: z.boolean(),
    });

    const createSql = convert(schema, "emails");
    await client.query(createSql);

    const insertSql = "INSERT INTO emails (email, verified) VALUES ($1, $2)";
    await expect(
      client.query(insertSql, ["test@example.com", true]),
    ).resolves.toBeTruthy();

    const selectSql = "SELECT * FROM emails WHERE email = $1";
    const result = await client.query(selectSql, ["test@example.com"]);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].email).toBe("test@example.com");
    expect(result.rows[0].verified).toBe(true);
  });
});
