'use client';
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';


interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: boolean;
}

export function PremiumCard({
  children,
  className = '',
  hoverScale = true,
}: PremiumCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };


  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={hoverScale ? { scale: 1.02, y: -8 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Glow effect that follows cursor */}
      {isHovering && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 212, 255, 0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Card content */}
      <div className="relative bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-8 transition-all duration-300 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_40px_rgba(0,212,255,0.2)] overflow-hidden h-full">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </motion.div>
  );
}
