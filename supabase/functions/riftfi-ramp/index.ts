import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RIFTFI_RAMP_URL = 'https://ramp.riftfi.xyz';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { action, ...params } = body;

    console.log(`RiftFi ${action} request for user ${user.id}:`, params);

    // Get user's wallet address
    const { data: walletData } = await supabaseClient
      .from('safe_wallet_view')
      .select('wallet_address')
      .eq('user_id', user.id)
      .eq('network', 'base')
      .single();

    if (!walletData?.wallet_address) {
      throw new Error('No wallet found. Please create a wallet first.');
    }

    let response;

    switch (action) {
      case 'exchange-rate':
        // Get current exchange rates
        response = await fetch(`${RIFTFI_RAMP_URL}/exchange-rate`);
        break;

      case 'onramp':
        // Onramp: Fiat (KES) to Crypto (USDC)
        // User pays with M-Pesa, receives USDC in their wallet
        const onrampPayload = {
          account_number: params.phoneNumber, // User's M-Pesa phone number
          amount: params.amount.toString(), // KES amount
          chain: 'BASE',
          asset: 'USDC',
          address: walletData.wallet_address, // Where to send USDC
          network: params.network || 'Safaricom',
          country_code: 'KES',
          callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/riftfi-webhook`
        };

        console.log('Onramp payload:', onrampPayload);

        response = await fetch(`${RIFTFI_RAMP_URL}/onramp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(onrampPayload),
        });
        break;

      case 'offramp':
        // Offramp: Crypto (USDC) to Fiat (KES)
        // User sends USDC, receives KES via M-Pesa
        const offrampPayload = {
          transaction_hash: params.txHash, // On-chain tx hash of USDC transfer
          amount: params.amount.toString(), // KES amount to disburse
          account_number: params.phoneNumber, // Recipient M-Pesa number
          network: params.network || 'Safaricom',
          country_code: 'KES',
          chain: 'BASE',
          asset: 'USDC',
          callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/riftfi-webhook`
        };

        console.log('Offramp payload:', offrampPayload);

        response = await fetch(`${RIFTFI_RAMP_URL}/offramp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offrampPayload),
        });
        break;

      case 'status':
        // Check transaction status
        response = await fetch(`${RIFTFI_RAMP_URL}/transaction/${params.transactionId}`);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('RiftFi API error:', data);
      throw new Error(data.message || data.error || 'RiftFi API request failed');
    }

    console.log(`RiftFi ${action} response:`, data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in riftfi-ramp function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});