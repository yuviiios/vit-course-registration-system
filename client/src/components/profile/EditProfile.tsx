import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import type { Student } from '@/types';

interface EditProfileProps {
  student: Student;
}

const BRANCHES = [
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'IT',
  'CSE (Cyber Security)',
  'CSE (AI & ML)',
  'CSE (Data Science)',
  'Other',
];

export function EditProfile({ student }: EditProfileProps) {
  const [open, setOpen] = useState(false);
  const [branch, setBranch] = useState(student.branch || '');
  const [semester, setSemester] = useState(student.semester?.toString() || '1');
  const toast = useToast();
  const { refreshUser } = useAuth();

  const updateMutation = useMutation({
    mutationFn: async (data: { branch: string; semester: number }) => {
      return authApi.updateProfile(data);
    },
    onSuccess: async () => {
      toast.success('Profile updated');
      await refreshUser();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branch || branch === 'UNKNOWN') {
      toast.error('Please select a valid branch');
      return;
    }

    const semesterNum = parseInt(semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      toast.error('Semester must be between 1 and 8');
      return;
    }

    updateMutation.mutate({ branch, semester: semesterNum });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g., CSE, ECE, MECH"
              list="branches"
            />
            <datalist id="branches">
              {BRANCHES.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground">
              Common: CSE, ECE, EEE, MECH, IT
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              type="number"
              min="1"
              max="8"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="1-8"
            />
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
