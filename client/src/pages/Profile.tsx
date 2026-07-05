import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const fields = [
    { label: 'Registration Number', value: user?.registrationNumber },
    { label: 'Email', value: user?.email },
    { label: 'Branch', value: user?.branch },
    { label: 'Semester', value: user?.semester?.toString() },
    { label: 'Role', value: user?.role },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user?.name}</CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <Badge>{user?.branch}</Badge>
              {user?.semester && <Badge variant="outline">Semester {user.semester}</Badge>}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-4">
              {fields.map(
                (field) =>
                  field.value && (
                    <div key={field.label} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{field.label}</span>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
