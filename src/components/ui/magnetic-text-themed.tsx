import { MagneticText } from './magnetic-text';
import { cn } from '@/lib/utils';

interface ThemedMagneticTextProps {
  text: string;
  hoverText?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
}

export function ThemedMagneticText({
  text,
  hoverText,
  className,
  variant = 'default',
}: ThemedMagneticTextProps) {
  const variants = {
    default: 'text-white',
    gradient:
      'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent',
    glow: 'text-cyan-400 drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]',
  };

  return (
    <div className={cn(variants[variant], className)}>
      <MagneticText text={text} hoverText={hoverText} />
    </div>
  );
}
