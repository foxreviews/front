import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function PremiumBadge({ className, size = 'md', showText = true }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold rounded-full shadow-lg',
        sizeClasses[size],
        className
      )}
    >
      <Crown className={iconSizes[size]} />
      {showText && <span>Premium</span>}
    </div>
  );
}
