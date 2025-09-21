import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Simplified user profile type matching Supabase profiles table
interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  role: 'client' | 'coach' | 'admin';
  status: string;
  timezone: string;
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export function useCurrentUserProfile() {
  const { user: authUser } = useAuth();
  
  return useQuery({
    queryKey: ['user-profile', authUser?.id],
    queryFn: async () => {
      if (!authUser) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!authUser) throw new Error('No authenticated user');
      
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', authUser.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedProfile as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    },
  });
}