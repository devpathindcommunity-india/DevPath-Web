'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
