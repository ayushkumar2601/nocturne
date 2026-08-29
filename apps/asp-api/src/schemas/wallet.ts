import { z } from "zod";
import { AddressSchema } from "./transaction.js";

export const AuditWalletRequestSchema = z.object({
  prompt: z.string().optional(),
  address: AddressSchema.optional(),
  walletAddress: AddressSchema.optional(),
}).refine((data) => data.address || data.walletAddress, {
  message: "Either 'address' or 'walletAddress' must be provided.",
});

export type AuditWalletRequest = z.infer<typeof AuditWalletRequestSchema>;
