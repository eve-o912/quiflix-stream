import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DistributorApplication {
  id: string;
  user_id: string;
  film_id: string;
  social_media_links: string[];
  audience_size: string | null;
  promotion_strategy: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  film?: {
    id: string;
    title: string;
    poster_url: string | null;
    direct_price: number;
  };
}

export interface DistributionToken {
  id: string;
  user_id: string;
  film_id: string;
  application_id: string;
  tracking_code: string;
  is_active: boolean;
  total_sales: number;
  total_revenue: number;
  total_earnings: number;
  created_at: string;
  revoked_at: string | null;
  film?: {
    id: string;
    title: string;
    poster_url: string | null;
    direct_price: number;
  };
}

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-distributor-applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('distributor_applications')
        .select(`
          *,
          film:films(id, title, poster_url, direct_price)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DistributorApplication[];
    },
  });
}

export function useMyDistributionTokens() {
  return useQuery({
    queryKey: ['my-distribution-tokens'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('distribution_tokens')
        .select(`
          *,
          film:films(id, title, poster_url, direct_price)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DistributionToken[];
    },
  });
}

export function useCheckExistingApplication(filmId: string) {
  return useQuery({
    queryKey: ['existing-application', filmId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('distributor_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('film_id', filmId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!filmId,
  });
}

export function useSubmitApplication() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      filmId,
      socialMediaLinks,
      audienceSize,
      promotionStrategy,
    }: {
      filmId: string;
      socialMediaLinks: string[];
      audienceSize: string;
      promotionStrategy: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('distributor_applications')
        .insert({
          user_id: user.id,
          film_id: filmId,
          social_media_links: socialMediaLinks,
          audience_size: audienceSize,
          promotion_strategy: promotionStrategy,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Application Submitted',
        description: 'Your distributor application has been submitted for review.',
      });
      queryClient.invalidateQueries({ queryKey: ['my-distributor-applications'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
