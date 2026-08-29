import { describe, it, expect } from 'vitest';
import { AddressSchema, EnsSchema } from '../schemas.js';

describe('Zod Schemas', () => {
  it('should validate correct ethereum addresses', () => {
    expect(AddressSchema.safeParse('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045').success).toBe(true);
  });

  it('should reject invalid ethereum addresses', () => {
    expect(AddressSchema.safeParse('0xinvalid').success).toBe(false);
    expect(AddressSchema.safeParse('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045').success).toBe(false);
  });

  it('should validate ENS names', () => {
    expect(EnsSchema.safeParse('vitalik.eth').success).toBe(true);
  });

  it('should reject invalid ENS names', () => {
    expect(EnsSchema.safeParse('vitalik').success).toBe(false);
  });
});
