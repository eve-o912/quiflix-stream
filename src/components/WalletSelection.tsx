import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Wallet, Shield, Chrome, Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WalletSelectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnected?: () => void;
}

export function WalletSelection({ open, onOpenChange, onWalletConnected }: WalletSelectionProps) {
  const [walletType, setWalletType] = useState<'custodial' | 'metamask' | 'coinbase' | 'onramp'>('custodial');
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleCustodialWallet = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Not authenticated',
          description: 'Please sign in first',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-wallet', {
        body: { network: 'base' }
      });

      if (error) throw error;

      toast({
        title: 'Custodial Wallet Created!',
        description: `Your wallet address: ${data.wallet_address.slice(0, 6)}...${data.wallet_address.slice(-4)}`,
      });

      onWalletConnected?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Wallet Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExternalWallet = async () => {
    const connector = walletType === 'metamask' 
      ? connectors.find(c => c.id === 'metaMask')
      : connectors.find(c => c.id === 'coinbaseWalletSDK');

    if (!connector) {
      toast({
        title: 'Wallet not found',
        description: `Please install ${walletType === 'metamask' ? 'MetaMask' : 'Coinbase Wallet'}`,
        variant: 'destructive',
      });
      return;
    }

    try {
      connect({ connector }, {
        onSuccess: () => {
          toast({
            title: 'Wallet Connected',
            description: 'Your external wallet has been connected successfully.',
          });
          onWalletConnected?.();
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: 'Connection Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      });
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleOnramp = () => {
    // Open MoonPay/Transak onramp in new tab (using MoonPay as example)
    const onrampUrl = 'https://www.moonpay.com/buy/usdc';
    window.open(onrampUrl, '_blank');
    toast({
      title: 'Fiat Onramp Opened',
      description: 'Complete your purchase in the new tab, then connect your wallet.',
    });
  };

  const handleConnect = () => {
    if (walletType === 'custodial') {
      handleCustodialWallet();
    } else if (walletType === 'onramp') {
      handleOnramp();
    } else {
      handleExternalWallet();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Wallet className="h-6 w-6 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Choose how you want to connect to QuiFlix
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup value={walletType} onValueChange={(v) => setWalletType(v as any)}>
            <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
              <RadioGroupItem value="custodial" id="custodial" />
              <Label htmlFor="custodial" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Custodial Wallet</p>
                    <p className="text-sm text-muted-foreground">Easy & secure - we manage your wallet</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
              <RadioGroupItem value="metamask" id="metamask" />
              <Label htmlFor="metamask" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Chrome className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">MetaMask</p>
                    <p className="text-sm text-muted-foreground">Connect your MetaMask wallet</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
              <RadioGroupItem value="coinbase" id="coinbase" />
              <Label htmlFor="coinbase" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Coinbase Wallet</p>
                    <p className="text-sm text-muted-foreground">Connect your Coinbase Wallet</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border border-primary/50 bg-primary/5 hover:bg-primary/10 cursor-pointer">
              <RadioGroupItem value="onramp" id="onramp" />
              <Label htmlFor="onramp" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Buy USDC with Card/M-Pesa</p>
                    <p className="text-sm text-muted-foreground">Convert local currency to USDC</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : walletType === 'onramp' ? (
              <>
                <ExternalLink className="mr-2 h-5 w-5" />
                Buy USDC
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>

          {walletType === 'onramp' && (
            <p className="text-xs text-center text-muted-foreground">
              Supports credit/debit cards, bank transfer, and M-Pesa
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
