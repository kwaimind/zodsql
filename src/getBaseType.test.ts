import { describe, expect, it } from 'vitest';
import * as z from 'zod/v4';
import { dialects } from './dialects';
import { getBaseType } from './getBaseType';

describe('getBaseType', () => {
  describe('postgres dialect', () => {
    it('maps string to VARCHAR(255)', () => {
      const result = getBaseType(z.string(), dialects.postgres);
      expect(result).toBe('VARCHAR(255)');
    });

    it('maps number to INTEGER', () => {
      const result = getBaseType(z.number(), dialects.postgres);
      expect(result).toBe('INTEGER');
    });

    it('maps boolean to BOOLEAN', () => {
      const result = getBaseType(z.boolean(), dialects.postgres);
      expect(result).toBe('BOOLEAN');
    });

    it('maps date to TIMESTAMP', () => {
      const result = getBaseType(z.date(), dialects.postgres);
      expect(result).toBe('TIMESTAMP');
    });

    it('uses fallback for unsupported types', () => {
      const result = getBaseType(z.array(z.string()), dialects.postgres);
      expect(result).toBe('TEXT');
    });
  });

  describe('mysql dialect', () => {
    it('maps string to VARCHAR(255)', () => {
      const result = getBaseType(z.string(), dialects.mysql);
      expect(result).toBe('VARCHAR(255)');
    });

    it('maps number to INT', () => {
      const result = getBaseType(z.number(), dialects.mysql);
      expect(result).toBe('INT');
    });

    it('maps boolean to TINYINT(1)', () => {
      const result = getBaseType(z.boolean(), dialects.mysql);
      expect(result).toBe('TINYINT(1)');
    });

    it('maps date to DATETIME', () => {
      const result = getBaseType(z.date(), dialects.mysql);
      expect(result).toBe('DATETIME');
    });

    it('uses fallback for unsupported types', () => {
      const result = getBaseType(z.array(z.string()), dialects.mysql);
      expect(result).toBe('TEXT');
    });
  });

  describe('sqlite dialect', () => {
    it('maps string to TEXT', () => {
      const result = getBaseType(z.string(), dialects.sqlite);
      expect(result).toBe('TEXT');
    });

    it('maps number to INTEGER', () => {
      const result = getBaseType(z.number(), dialects.sqlite);
      expect(result).toBe('INTEGER');
    });

    it('maps boolean to INTEGER', () => {
      const result = getBaseType(z.boolean(), dialects.sqlite);
      expect(result).toBe('INTEGER');
    });

    it('maps date to TEXT', () => {
      const result = getBaseType(z.date(), dialects.sqlite);
      expect(result).toBe('TEXT');
    });

    it('uses fallback for unsupported types', () => {
      const result = getBaseType(z.array(z.string()), dialects.sqlite);
      expect(result).toBe('TEXT');
    });
  });
});
