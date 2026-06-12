'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionEntranceProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionEntrance({
  children,
  className = '',
  delay = 0,
}: SectionEntranceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
