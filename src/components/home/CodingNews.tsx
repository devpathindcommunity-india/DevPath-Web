'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Newspaper, RefreshCw, AlertCircle } from 'lucide-react';
import styles from './CodingNews.module.css';

interface NewsItem {
  source: string;
  title: string;
  url: string;
  image: string | null;
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    source: 'DevPath Blog',
    title:
      'Optimizing Next.js Web Vitals: A Deep Dive into LCP, FID, and CLS for 2026',
    url: 'https://devpath.in',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
  },
  {
    source: 'Agentic Tech',
    title:
      'The Rise of Agentic AI: How Advanced Coding Assistants are Redefining Developer Workflows',
    url: 'https://techcrunch.com',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',
  },
  {
    source: 'Next.js Blog',
    title:
      'Next.js 16 Released: Turbopack for Faster Builds, React 19 Support, and Server Actions',
    url: 'https://vercel.com/blog',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
  },
  {
    source: 'GitHub',
    title:
      'Open Source India: Empowering the Next Generation of Developers Nationwide',
    url: 'https://github.blog',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
  },
];

const FALLBACK_NEWS_IMAGE =
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000&auto=format&fit=crop';

interface NewsCardImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

function NewsCardImage({ src, alt, sizes, priority }: NewsCardImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={styles.image}
      sizes={sizes}
      priority={priority}
      onError={() => setImgSrc(FALLBACK_NEWS_IMAGE)}
    />
  );
}

export default function CodingNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_NEWS_API_URL;
      if (!apiUrl) {
        setNews(FALLBACK_NEWS);
        return;
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setNews(FALLBACK_NEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="flex items-center gap-3">
            <div className={styles.iconWrapper}>
              <Newspaper size={24} />
            </div>
            <h2 className={styles.title}>Latest Tech News</h2>
          </div>
          <button
            onClick={fetchNews}
            className={styles.refreshButton}
            disabled={loading}
            aria-label="Refresh news"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonContent}>
                  <div
                    className={styles.skeletonLine}
                    style={{ width: '80%' }}
                  />
                  <div
                    className={styles.skeletonLine}
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.scrollContainer}>
            <div className={styles.scrollTrack}>
              {news.map((item, index) => (
                <motion.a
                  key={`${index}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={styles.imageWrapper}>
                    {item.image ? (
                      <NewsCardImage
                        src={item.image}
                        alt={item.title}
                        sizes="(max-width: 640px) 280px, 320px"
                        priority={index < 2}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <Newspaper size={32} opacity={0.5} />
                      </div>
                    )}
                    <div className={styles.sourceBadge}>{item.source}</div>
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.readMore}>
                        Read Article <ExternalLink size={14} />
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
