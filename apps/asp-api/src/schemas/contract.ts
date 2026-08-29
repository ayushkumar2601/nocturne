import { z } from "zod";
import { AddressSchema } from "./transaction.js";

export const AnalyzeContractRequestSchema = z.object({
  prompt: z.string().optional(),
  contractAddress: AddressSchema,
});

export type AnalyzeContractRequest = z.infer<typeof AnalyzeContractRequestSchema>;
