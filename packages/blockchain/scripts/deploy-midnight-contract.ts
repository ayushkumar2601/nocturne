import { createMidnightProvider, NodeWallet } from '@midnight-ntwrk/midnight-js';
import fs from 'fs';
import path from 'path';

// WARNING: You must replace 'YOUR_SEED_PHRASE' with your actual Lace wallet seed phrase, 
// or run this with an environment variable.
const SEED_PHRASE = process.env.MIDNIGHT_SEED_PHRASE || 'YOUR_SEED_PHRASE';

async function deployContract() {
  console.log("Starting Midnight ShieldedRiskProfile deployment...");

  try {
    // 1. Initialize the Wallet and Provider
    // Connects to the Midnight Preview Testnet
    const wallet = await NodeWallet.build({ seedPhrase: SEED_PHRASE });
    const provider = await createMidnightProvider({
      nodeUrl: process.env.MIDNIGHT_NODE_URL || 'https://rpc.preview.midnight.network',
      wallet,
    });

    console.log(`Connected with address: ${wallet.address}`);

    // 2. Load the compiled Compact Contract (Ensure you run 'compactc' first)
    // The compiler generates a .zkir and .wasm file. We assume they are in a 'dist' folder.
    const wasmPath = path.resolve(__dirname, '../src/midnight/contracts/dist/ShieldedRiskProfile.wasm');
    const zkirPath = path.resolve(__dirname, '../src/midnight/contracts/dist/ShieldedRiskProfile.zkir');
    
    if (!fs.existsSync(wasmPath) || !fs.existsSync(zkirPath)) {
      throw new Error("Compiled contract files not found. Please run 'compactc ShieldedRiskProfile.compact' first.");
    }

    const wasm = fs.readFileSync(wasmPath);
    const zkir = fs.readFileSync(zkirPath);

    console.log("Contract files loaded. Initiating deployment (this will cost tMID)...");

    // 3. Deploy the Contract
    // We deploy the contract and pass initial state if required by the Compact logic.
    const deployedContract = await provider.deployContract({
      zkir,
      wasm,
      initialState: {}, // Our contract has empty initial state for riskScores map
    });

    console.log(`✅ Deployment Successful!`);
    console.log(`📜 Contract Address: ${deployedContract.address}`);
    
    // Optional: Make a test interaction (Update Risk Score)
    console.log(`Updating risk score to 15 (Safe)...`);
    const tx = await deployedContract.call('updateRiskScore', [wallet.address, 15]);
    console.log(`Transaction successful. TX Hash: ${tx.hash}`);

  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

deployContract();
