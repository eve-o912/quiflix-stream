import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Wallet, Film, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { QUIFLIX_NFT_ABI, QUIFLIX_CONTENT_ABI, CONTRACT_ADDRESSES } from '@/config/contracts';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filmId: number;
  filmTitle: string;
  price: string;
}

export function PurchaseDialog({ open, onOpenChange, filmId, filmTitle, price }: PurchaseDialogProps) {
  const [purchaseType, setPurchaseType] = useState<'nft' | 'direct'>('nft');
  const [network, setNetwork] = useState<'base' | 'lisk'>('base');
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const priceInWei = parseEther(price);
      
      if (purchaseType === 'nft') {
        // NFT Purchase
        writeContract({
          address: CONTRACT_ADDRESSES[network].nft as `0x${string}`,
          abi: QUIFLIX_NFT_ABI,
          functionName: 'purchaseFilm',
          args: [BigInt(filmId)],
          value: priceInWei,
        } as any);
      } else {
        // Direct Purchase
        writeContract({
          address: CONTRACT_ADDRESSES[network].content as `0x${string}`,
          abi: QUIFLIX_CONTENT_ABI,
          functionName: 'distributeRevenue',
          args: [BigInt(filmId)],
          value: priceInWei,
        } as any);
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      toast({
        title: "Purchase Successful! 🎉",
        description: `You now own ${filmTitle}. Enjoy your film!`,
      });
      onOpenChange(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Film className="h-6 w-6 text-primary" />
            Purchase {filmTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your purchase method and network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Purchase Type Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Purchase Type</Label>
            <RadioGroup value={purchaseType} onValueChange={(v) => setPurchaseType(v as 'nft' | 'direct')}>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="nft" id="nft" />
                <Label htmlFor="nft" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-foreground">NFT Ticket (Resellable)</p>
                    <p className="text-sm text-muted-foreground">Own the film as an NFT, can be resold</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-foreground">Direct Access</p>
                    <p className="text-sm text-muted-foreground">Stream-only access, lower price</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Network Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Network (USDC Payment)</Label>
            <RadioGroup value={network} onValueChange={(v) => setNetwork(v as 'base' | 'lisk')}>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="base" id="base" />
                <Label htmlFor="base" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-foreground">Base Network</p>
                    <p className="text-sm text-muted-foreground">Lower fees, faster transactions</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="lisk" id="lisk" />
                <Label htmlFor="lisk" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-foreground">Lisk Network</p>
                    <p className="text-sm text-muted-foreground">Optimized for content creators</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Price Display */}
          <div className="p-4 rounded-lg bg-secondary/20 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Price</span>
              <span className="text-2xl font-bold text-primary">{price} USDC</span>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={!isConnected || isPending || isConfirming}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isPending ? 'Confirming...' : 'Processing...'}
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                {isConnected ? 'Complete Purchase' : 'Connect Wallet First'}
              </>
            )}
          </Button>

          {!isConnected && (
            <p className="text-sm text-center text-muted-foreground">
              Please connect your wallet to proceed with the purchase
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
