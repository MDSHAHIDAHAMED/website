/**
 * RPC Proxy Route
 * ================
 *
 * Proxies JSON-RPC requests to the Sepolia testnet RPC endpoint.
 * This bypasses CORS issues since the request is made server-side.
 *
 * Uses getSepoliaRpcUrl() (NEXT_PUBLIC_SEPOLIA_CHAIN_RPC_URL from env, or default).
 * We read response as text first and only parse as JSON when it looks like JSON,
 * so we avoid "Unexpected token '<'" when the upstream returns HTML.
 */

import { getSepoliaRpcUrl } from '@/constants/rpc';
import { NextRequest, NextResponse } from 'next/server';

const RPC_URL = getSepoliaRpcUrl();

/**
 * Handle POST requests for JSON-RPC calls.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const raw = await response.text();
    const trimmed = raw.trim();

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.error('[RPC Proxy] Upstream returned non-JSON. URL:', RPC_URL, 'Preview:', trimmed.slice(0, 120));
      return NextResponse.json(
        { jsonrpc: '2.0', id: (body as { id?: unknown })?.id ?? null, error: { code: -32603, message: 'Upstream RPC returned non-JSON.' } },
        { status: 502 }
      );
    }

    const data = JSON.parse(raw) as unknown;
    return NextResponse.json(data);
  } catch (error) {
    console.error('[RPC Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to proxy RPC request' }, { status: 500 });
  }
}
 
/**
* Handle OPTIONS requests for CORS preflight
*/
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
 