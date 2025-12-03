import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Wallet, Film, Loader2, TrendingUp, Sparkles, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { USDC_ABI, CONTRACT_ADDRESSES } from '@/config/contracts';
import { USDC_ADDRESSES } from '@/config/web3';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filmId: string;
  filmTitle: string;
  directPrice: number;
  nftPrice: number;
  investmentPricePerShare?: number;
  availableShares?: number;
}

export function PurchaseDialog({ 
  open, 
  onOpenChange, 
  filmId, 
  filmTitle, 
  directPrice,
  nftPrice,
  investmentPricePerShare = 0,
  availableShares = 0
}: PurchaseDialogProps) {
  const [purchaseType, setPurchaseType] = useState<'nft' | 'direct' | 'investment'>('nft');
  const [network, setNetwork] = useState<'base' | 'lisk' | 'scroll' | 'celo'>('base');
  const [shares, setShares] = useState(1);
  const [step, setStep] = useState<'select' | 'approve' | 'purchase'>('select');
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const investmentAvailable = availableShares > 0 && investmentPricePerShare > 0;
  
  const getPrice = () => {
    if (purchaseType === 'investment') return (investmentPricePerShare * shares).toFixed(2);
    if (purchaseType === 'nft') return nftPrice.toFixed(2);
    return directPrice.toFixed(2);
  };

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
      const price = getPrice();
      const amountInUSDC = parseUnits(price, 6);
      const contractAddress = purchaseType === 'nft' 
        ? CONTRACT_ADDRESSES[network].nft 
        : CONTRACT_ADDRESSES[network].content;

      setStep('approve');
      
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

  const recordPurchase = async (txHash: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const price = parseFloat(getPrice());

      if (purchaseType === 'investment') {
        // Record investment
        await supabase.from('investments').insert({
          investor_id: user.id,
          film_id: filmId,
          shares_owned: shares,
          amount_invested: price,
          tx_hash: txHash,
        });
      } else {
        // Record purchase
        await supabase.from('purchases').insert({
          user_id: user.id,
          film_id: filmId,
          purchase_type: purchaseType,
          amount: price,
          network: network,
          tx_hash: txHash,
        });
      }
    } catch (error) {
      console.error('Failed to record purchase:', error);
    }
  };

  const handlePurchase = async () => {
    toast({
      title: "Purchase Initiated",
      description: "Your transaction is being processed on the blockchain.",
    });
    setStep('purchase');
    
    // Record in database (in production, this would be after actual tx confirmation)
    if (hash) {
      await recordPurchase(hash);
    }
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
      const successMessage = purchaseType === 'investment' 
        ? `You now own ${shares} shares of ${filmTitle}. Earn when fans watch!`
        : `You now own ${filmTitle}. Enjoy your film!`;
      
      toast({
        title: "Purchase Successful! 🎉",
        description: successMessage,
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
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Film className="h-6 w-6 text-primary" />
            {filmTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Own, watch, or invest in this film
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Purchase Type Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Choose Your Option</Label>
            <RadioGroup value={purchaseType} onValueChange={(v) => setPurchaseType(v as 'nft' | 'direct' | 'investment')}>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="nft" id="nft" />
                <Label htmlFor="nft" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">NFT Ticket (${nftPrice})</p>
                      <p className="text-sm text-muted-foreground">Own as NFT, resell anytime, earn royalties</p>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Direct Access (${directPrice})</p>
                      <p className="text-sm text-muted-foreground">Stream-only access, lowest price</p>
                    </div>
                  </div>
                </Label>
              </div>

              {investmentAvailable && (
                <div className="flex items-center space-x-2 p-4 rounded-lg border border-primary/50 bg-primary/5 hover:bg-primary/10 cursor-pointer">
                  <RadioGroupItem value="investment" id="investment" />
                  <Label htmlFor="investment" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Invest (${investmentPricePerShare}/share)</p>
                        <p className="text-sm text-muted-foreground">
                          Earn 20% of film revenue • {availableShares} shares left
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Shares Input for Investment */}
          {purchaseType === 'investment' && (
            <div className="space-y-2">
              <Label className="text-foreground">Number of Shares</Label>
              <Input
                type="number"
                min={1}
                max={availableShares}
                value={shares}
                onChange={(e) => setShares(Math.min(parseInt(e.target.value) || 1, availableShares))}
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                Max {availableShares} shares • Each share = {(1 / 100 * 20).toFixed(2)}% of investor pool
              </p>
            </div>
          )}

          {/* Network Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Payment Network</Label>
            <RadioGroup value={network} onValueChange={(v) => setNetwork(v as 'base' | 'lisk' | 'scroll' | 'celo')}>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="base" id="base" />
                  <Label htmlFor="base" className="cursor-pointer text-sm">
                    <span className="font-medium text-foreground">Base</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="lisk" id="lisk" />
                  <Label htmlFor="lisk" className="cursor-pointer text-sm">
                    <span className="font-medium text-foreground">Lisk</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="scroll" id="scroll" />
                  <Label htmlFor="scroll" className="cursor-pointer text-sm">
                    <span className="font-medium text-foreground">Scroll</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value="celo" id="celo" />
                  <Label htmlFor="celo" className="cursor-pointer text-sm">
                    <span className="font-medium text-foreground">Celo</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Price Display */}
          <div className="p-4 rounded-lg bg-secondary/20 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Price</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{getPrice()} USDC</span>
                <p className="text-xs text-muted-foreground">≈ ${getPrice()} USD</p>
              </div>
            </div>
            {purchaseType === 'investment' && (
              <p className="text-xs text-primary mt-2">
                💰 Potential earnings: Earn your share of 20% of all film revenue
              </p>
            )}
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
                {isConnected 
                  ? purchaseType === 'investment' 
                    ? `Invest ${getPrice()} USDC` 
                    : `Pay ${getPrice()} USDC`
                  : 'Connect Wallet First'}
              </>
            )}
          </Button>

          {!isConnected && (
            <p className="text-sm text-center text-muted-foreground">
              Please connect your wallet to proceed
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
