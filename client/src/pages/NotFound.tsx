import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <FileQuestion className="h-16 w-16 mx-auto mb-6 text-muted-foreground/40" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </motion.div>
    </div>
  );
}
