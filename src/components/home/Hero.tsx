'use client';

import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';
import styles from './Hero.module.css';
import { useEffect, useState, useRef } from 'react';
const LatestEventsHighlight = dynamic(() => import('./LatestEventsHighlight'));


function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>

      <div className={`${styles.content} relative z-10`}>
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative w-full max-w-[800px] mb-4">
            <div className="flex flex-col items-center gap-2">
              <h1 className={styles.title}>
                The Ecosystem for <br />
                <span className="text-primary">Ambitious Developers</span>
              </h1>
            </div>
          </div>
        </div>
        <p className={styles.subtitle}>
          Stop coding alone. Join <strong>500+ active developers</strong>{' '}
          building real-world projects, contributing to open source, and
          accelerating their careers together.
        </p>

        <div className="flex flex-wrap justify-center gap-8 my-8">
          <div className={`${styles.statsItem} flex flex-col items-center`}>
            <span className="text-3xl font-bold text-foreground">
              <AnimatedCounter target={500} suffix="+" />
            </span>
            <span className="text-sm text-muted-foreground">
              Active Developers
            </span>
          </div>
          <div className={`${styles.statsItem} flex flex-col items-center`}>
            <span className="text-3xl font-bold text-foreground">
              <AnimatedCounter target={50} suffix="+" />
            </span>
            <span className="text-sm text-muted-foreground">
              Open Source Projects
            </span>
          </div>
          <div className={`${styles.statsItem} flex flex-col items-center`}>
            <span className="text-3xl font-bold text-foreground">
              <AnimatedCounter target={24} suffix="/7" />
            </span>
            <span className="text-sm text-muted-foreground">Peer Support</span>
          </div>
        </div>

        <div
          className={`${styles.ctas} flex flex-col sm:flex-row items-center gap-4 sm:gap-2`}
        >

          <Link
            href="https://linkly.link/2WCTY"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              aria-label="Join Community"
              variant="primary"
              icon={<ArrowRight size={20} />}
              className="w-full sm:w-auto justify-center"
            >
              Join Community
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Content Grid */}
      <div className="w-full px-2 mt-12 grid grid-cols-1 gap-4 relative z-10">
        <LatestEventsHighlight className="w-full mt-0 mb-0" />
      </div>
    </section>
  );
}
