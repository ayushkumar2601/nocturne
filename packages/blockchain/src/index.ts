export * from './ethereum/client.js';
export * from './chain-router.js';

// We can export the ethereum services for backwards compatibility if needed internally,
// but the external usage should go through ChainRouter.
export { BalanceService as EthBalanceService } from './ethereum/services/BalanceService.js';
export { EnsService as EthEnsService } from './ethereum/services/EnsService.js';
export { TransactionService as EthTransactionService } from './ethereum/services/TransactionService.js';
export { TransactionExecutionService as EthTransactionExecutionService } from './ethereum/services/TransactionExecutionService.js';
