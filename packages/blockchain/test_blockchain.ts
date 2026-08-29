import { BalanceService, EnsService } from './src/index.js';

async function run() {
  const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // vitalik.eth
  console.log(`Testing BalanceService for ${address}...`);
  try {
    const balance = await BalanceService.getBalance(address);
    console.log('Balance result:', balance);
  } catch (err) {
    console.error('Balance fetching failed', err);
  }

  console.log(`Testing EnsService for vitalik.eth...`);
  try {
    const ens = await EnsService.resolveName('vitalik.eth');
    console.log('ENS result:', ens);
  } catch (err) {
    console.error('ENS fetching failed', err);
  }
  process.exit(0);
}
run();
