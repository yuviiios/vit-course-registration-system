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

interface EditCGPAProps {
  currentValue: number;
}

export function EditCGPA({ currentValue }: EditCGPAProps) {
  const [open, setOpen] = useState(false);
  const [cgpa, setCgpa] = useState(currentValue.toString());
  const toast = useToast();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const updateMutation = useMutation({
    mutationFn: async (cgpa: number) => {
      return authApi.updateProfile({ cgpa });
    },
    onSuccess: async () => {
      toast.success('CGPA updated');
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      setOpen(false);
    },
    onError: (err: any) => {
      console.error('Update error:', err);
      toast.error(err?.response?.data?.message || 'Failed to update CGPA');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(cgpa);

    if (isNaN(value) || value < 0 || value > 10) {
      toast.error('CGPA must be between 0 and 10');
      return;
    }

    updateMutation.mutate(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit CGPA">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Current CGPA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cgpa">Current CGPA</Label>
            <Input
              id="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="8.10"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Your cumulative grade point average (0-10 scale)
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
