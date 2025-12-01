import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base network RPC
const BASE_RPC_URL = 'https://mainnet.base.org';

// USDC and USDT contract addresses on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDT_ADDRESS = '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2';

// ERC20 ABI for balanceOf
const ERC20_ABI = {
  balanceOf: '0x70a08231', // function selector for balanceOf(address)
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    console.log(`Fetching balance for wallet: ${walletAddress}`);

    // Fetch USDC balance
    const usdcBalance = await getTokenBalance(walletAddress, USDC_ADDRESS, 6);
    
    // Fetch USDT balance
    const usdtBalance = await getTokenBalance(walletAddress, USDT_ADDRESS, 6);

    console.log(`USDC Balance: ${usdcBalance}, USDT Balance: ${usdtBalance}`);

    // Get exchange rates (USD to KES)
    const exchangeRate = await getUsdToKesRate();
    
    console.log(`Exchange Rate (USD to KES): ${exchangeRate}`);

    // Convert to KES
    const usdcInKes = usdcBalance * exchangeRate;
    const usdtInKes = usdtBalance * exchangeRate;
    const totalKes = usdcInKes + usdtInKes;

    return new Response(
      JSON.stringify({
        usdc: usdcBalance.toFixed(2),
        usdt: usdtBalance.toFixed(2),
        kes: totalKes.toFixed(2),
        exchangeRate: exchangeRate.toFixed(2),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        usdc: '0.00',
        usdt: '0.00',
        kes: '0.00',
        exchangeRate: '0.00',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with zero balances instead of error
      }
    );
  }
});

async function getTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  decimals: number
): Promise<number> {
  try {
    // Encode the balanceOf call data
    const paddedAddress = walletAddress.slice(2).padStart(64, '0');
    const data = ERC20_ABI.balanceOf + paddedAddress;

    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: tokenAddress,
            data: data,
          },
          'latest',
        ],
        id: 1,
      }),
    });

    const result = await response.json();

    if (result.error) {
      console.error('RPC Error:', result.error);
      return 0;
    }

    // Convert hex result to number
    const balanceHex = result.result;
    const balanceWei = BigInt(balanceHex);
    const balance = Number(balanceWei) / Math.pow(10, decimals);

    return balance;
  } catch (error) {
    console.error(`Error fetching ${tokenAddress} balance:`, error);
    return 0;
  }
}

async function getUsdToKesRate(): Promise<number> {
  try {
    // Using CoinGecko API (free, no key required for basic calls)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=kes'
    );

    if (!response.ok) {
      console.warn('Failed to fetch exchange rate, using fallback');
      return 130; // Fallback rate ~130 KES per USD
    }

    const data = await response.json();
    return data.usd?.kes || 130;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 130; // Fallback rate
  }
}
