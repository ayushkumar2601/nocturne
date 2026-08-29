import { z } from "zod";

export const AddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{36,40}$/, "Invalid Ethereum address format");

export const CalldataSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]*$/, "Malformed hex calldata format");

export const AnalyzeTransactionRequestSchema = z.object({
  prompt: z.string().optional(),
  transaction: z.object({
    from: AddressSchema,
    to: AddressSchema,
    value: z.string().default("0"),
    data: CalldataSchema.optional().default("0x"),
  }),
});

export type AnalyzeTransactionRequest = z.infer<typeof AnalyzeTransactionRequestSchema>;
