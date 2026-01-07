import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSubmitApplication, useCheckExistingApplication } from '@/hooks/useDistribution';
import { Film } from '@/hooks/useFilms';

interface DistributorApplicationFormProps {
  film: Film;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DistributorApplicationForm({
  film,
  open,
  onOpenChange,
}: DistributorApplicationFormProps) {
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);
  const [audienceSize, setAudienceSize] = useState('');
  const [promotionStrategy, setPromotionStrategy] = useState('');

  const { data: existingApplication, isLoading: checkingExisting } = useCheckExistingApplication(film.id);
  const submitApplication = useSubmitApplication();

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, value: string) => {
    const updated = [...socialLinks];
    updated[index] = value;
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredLinks = socialLinks.filter(link => link.trim() !== '');
    
    if (filteredLinks.length === 0) {
      return;
    }

    if (!promotionStrategy.trim()) {
      return;
    }

    await submitApplication.mutateAsync({
      filmId: film.id,
      socialMediaLinks: filteredLinks,
      audienceSize,
      promotionStrategy,
    });

    onOpenChange(false);
    setSocialLinks(['']);
    setAudienceSize('');
    setPromotionStrategy('');
  };

  const hasExistingApplication = existingApplication !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Apply to Distribute</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Apply to become a distributor for "{film.title}" and earn 20% from every sale you generate.
          </DialogDescription>
        </DialogHeader>

        {checkingExisting ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : hasExistingApplication ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-2">
              You already have an application for this film.
            </p>
            <p className="text-sm">
              Status:{' '}
              <span className={
                existingApplication.status === 'approved' 
                  ? 'text-green-500' 
                  : existingApplication.status === 'rejected'
                  ? 'text-red-500'
                  : 'text-yellow-500'
              }>
                {existingApplication.status.charAt(0).toUpperCase() + existingApplication.status.slice(1)}
              </span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Social Media Links *</Label>
              <p className="text-xs text-muted-foreground">
                Add your social media profiles to show your reach
              </p>
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => updateSocialLink(index, e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="bg-background border-border text-foreground"
                  />
                  {socialLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Link
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceSize" className="text-foreground">
                Audience Size
              </Label>
              <Select value={audienceSize} onValueChange={setAudienceSize}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select your audience size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under 1,000 followers</SelectItem>
                  <SelectItem value="1k-10k">1,000 - 10,000 followers</SelectItem>
                  <SelectItem value="10k-50k">10,000 - 50,000 followers</SelectItem>
                  <SelectItem value="50k-100k">50,000 - 100,000 followers</SelectItem>
                  <SelectItem value="100k-500k">100,000 - 500,000 followers</SelectItem>
                  <SelectItem value="500k+">500,000+ followers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionStrategy" className="text-foreground">
                Promotion Strategy *
              </Label>
              <Textarea
                id="promotionStrategy"
                value={promotionStrategy}
                onChange={(e) => setPromotionStrategy(e.target.value)}
                placeholder="Describe how you plan to promote this film to your audience..."
                className="bg-background border-border text-foreground min-h-[100px]"
                required
              />
            </div>

            <div className="bg-muted/30 p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Revenue Split:</strong> You earn 20% of every sale made through your unique tracking link.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitApplication.isPending}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {submitApplication.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
