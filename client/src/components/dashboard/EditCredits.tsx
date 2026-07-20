import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';

interface EditCreditsProps {
  currentValue: number;
}

export function EditCredits({ currentValue }: EditCreditsProps) {
  const [open, setOpen] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState(currentValue.toString());
  const toast = useToast();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const updateMutation = useMutation({
    mutationFn: async (earnedCredits: number) => {
      return authApi.updateProfile({ earnedCredits });
    },
    onSuccess: async () => {
      toast.success('Credits updated');
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      setOpen(false);
    },
    onError: (err: any) => {
      console.error('Update error:', err);
      toast.error(err?.response?.data?.message || 'Failed to update credits');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(earnedCredits);

    if (isNaN(value) || value < 0) {
      toast.error('Invalid credits value');
      return;
    }

    updateMutation.mutate(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Earned Credits</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="earnedCredits">Earned Credits</Label>
            <Input
              id="earnedCredits"
              type="number"
              step="0.5"
              min="0"
              value={earnedCredits}
              onChange={(e) => setEarnedCredits(e.target.value)}
              placeholder="140.0"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Total credits you have completed so far
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
