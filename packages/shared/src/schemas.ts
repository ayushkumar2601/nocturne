import { z } from 'zod';
import { SupportedChain } from './chain.js';

export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid blockchain address");
export const EnsSchema = z.string().min(3).endsWith(".eth", "Invalid ENS name");

export const GetBalanceInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  address: AddressSchema
});

export const GetTokenBalancesInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  address: AddressSchema
});

export const GetTransactionsInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  address: AddressSchema
});

export const GetWalletSummaryInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  address: AddressSchema
});

export const ResolveEnsInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  name: z.string().min(3).regex(/\.eth$/),
});

export const EstimateGasInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().default('0'), // String to prevent precision loss for BigInt
  data: z.string().regex(/^0x[a-fA-F0-9]*$/).optional(),
});

export const SimulateTransactionInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().default('0'),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/).optional(),
});

export const CreateTransactionDraftInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string().default('0'),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/).optional(),
});

export const AnalyzeTransactionRiskInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  draftId: z.string().min(1),
});

export const ApproveTransactionInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  draftId: z.string().min(1),
});

export const AnalyzeWalletInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export const DetectRiskyApprovalsInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export const BroadcastTransactionInputSchema = z.object({
  chain: z.nativeEnum(SupportedChain).optional(),
  draftId: z.string().min(1).optional(),
  signedTransaction: z.string().regex(/^0x[a-fA-F0-9]+$/),
});
