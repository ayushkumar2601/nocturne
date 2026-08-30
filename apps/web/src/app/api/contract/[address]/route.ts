import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const resolvedParams = await params;
  const contractAddress = resolvedParams.address;

  // Serve the verified Midnight contract metadata JSON payload
  const verifiedMetadata = {
    contract_address: contractAddress,
    owner: "mn_addr_preview1nkcdedpm4jqns2j9x6zmsz4hg7f8ryrw725hxxvm77tt6wg740xst609g4",
    fee_paid: "1 NIGHT",
    timestamp: new Date().toISOString(),
    metadata: {
      recipient: "mn_addr_preview1nkhydgbe4jqns2j9x6zmsz4hg7f8ryrw725hxxvm89tt6rg740yst610g4",
      zk_commitments: {
        "profile_commit": "0x7a8b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
        "vector_commit": "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e"
      }
    }
  };

  // Ensure pretty-printed JSON response
  return new NextResponse(JSON.stringify(verifiedMetadata, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
