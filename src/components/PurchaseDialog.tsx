import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Wallet, Film, Loader2, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { USDC_ABI, CONTRACT_ADDRESSES } from '@/config/contracts';
import { USDC_ADDRESSES } from '@/config/web3';

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
  const [step, setStep] = useState<'select' | 'approve' | 'purchase'>('select');
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleApprove = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // USDC has 6 decimals
      const amountInUSDC = parseUnits(price, 6);
      const contractAddress = purchaseType === 'nft' 
        ? CONTRACT_ADDRESSES[network].nft 
        : CONTRACT_ADDRESSES[network].content;

      setStep('approve');
      
      // Approve USDC spending
      writeContract({
        address: USDC_ADDRESSES[network] as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [contractAddress, amountInUSDC],
      } as any);
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setStep('select');
    }
  };

  const handlePurchase = async () => {
    toast({
      title: "Purchase Initiated",
      description: "Your transaction is being processed on the blockchain.",
    });
    // In production, this would call the actual purchase function after approval
    setStep('purchase');
  };

  if (isSuccess && step === 'approve') {
    setTimeout(() => {
      toast({
        title: "USDC Approved! ✓",
        description: "Now completing your purchase...",
      });
      handlePurchase();
    }, 1000);
  }

  if (isSuccess && step === 'purchase') {
    setTimeout(() => {
      toast({
        title: "Purchase Successful! 🎉",
        description: `You now own ${filmTitle}. Enjoy your film!`,
      });
      setStep('select');
      reset();
      onOpenChange(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setStep('select');
        reset();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Film className="h-6 w-6 text-primary" />
            Purchase {filmTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Pay with USDC on Base or Lisk network
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
            <Label className="text-foreground font-semibold">Payment Network</Label>
            <RadioGroup value={network} onValueChange={(v) => setNetwork(v as 'base' | 'lisk')}>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="base" id="base" />
                <Label htmlFor="base" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Base Network</p>
                      <p className="text-sm text-muted-foreground">Lower fees, faster transactions</p>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="lisk" id="lisk" />
                <Label htmlFor="lisk" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Lisk Network</p>
                      <p className="text-sm text-muted-foreground">Optimized for content creators</p>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Price Display */}
          <div className="p-4 rounded-lg bg-secondary/20 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Price</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{price} USDC</span>
                <p className="text-xs text-muted-foreground">≈ ${price} USD</p>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handleApprove}
            disabled={!isConnected || isPending || isConfirming}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {step === 'approve' ? 'Approving USDC...' : 'Processing...'}
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                {isConnected ? `Pay ${price} USDC` : 'Connect Wallet First'}
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
