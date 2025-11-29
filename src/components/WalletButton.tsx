import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const metamaskConnector = connectors.find(c => c.id === 'metaMask');
    const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK');
    
    if (metamaskConnector) {
      connect({ connector: metamaskConnector }, {
        onSuccess: () => {
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully.",
          });
        },
        onError: (error) => {
          // Try Coinbase if MetaMask fails
          if (coinbaseConnector) {
            connect({ connector: coinbaseConnector });
          } else {
            toast({
              title: "Connection Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      });
    } else if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
