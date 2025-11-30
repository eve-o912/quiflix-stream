import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { WalletSelection } from './WalletSelection';
import { Wallet, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function WalletButton() {
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [custodialAddress, setCustodialAddress] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Check for custodial wallet on component mount
  useState(() => {
    const checkCustodialWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('custodial_wallets')
          .select('wallet_address')
          .eq('user_id', user.id)
          .eq('network', 'base')
          .single();
        
        if (data) {
          setCustodialAddress(data.wallet_address);
        }
      }
    };
    checkCustodialWallet();
  });

  const handleDisconnect = () => {
    if (isConnected) {
      disconnect();
    }
    setCustodialAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const displayAddress = address || custodialAddress;

  if (displayAddress) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        {displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setShowWalletDialog(true)} className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
      <WalletSelection 
        open={showWalletDialog} 
        onOpenChange={setShowWalletDialog}
        onWalletConnected={() => {
          // Refresh custodial wallet status
          const checkWallet = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data } = await supabase
                .from('custodial_wallets')
                .select('wallet_address')
                .eq('user_id', user.id)
                .eq('network', 'base')
                .single();
              
              if (data) {
                setCustodialAddress(data.wallet_address);
              }
            }
          };
          checkWallet();
        }}
      />
    </>
  );
}
