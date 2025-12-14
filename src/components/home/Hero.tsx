import { Download, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.glow} />

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Master Your<br />
                    Developer Journey
                </h1>
                <p className={styles.subtitle}>
                    Join 50,000+ developers accelerating their coding skills through structured paths,
                    real projects, and an active community.
                </p>

                <div className={styles.ctas}>
                    <Button variant="primary" icon={<Download size={20} />}>
                        Download App
                    </Button>
                    <Button variant="secondary" icon={<ArrowRight size={20} />}>
                        Explore Paths
                    </Button>
                </div>
            </div>

            <div className={styles.mockupContainer}>
                <div className={styles.laptop}>
                    <div className={styles.screen}>
                        <div className={styles.screenContent}>
                            <div className={styles.sidebar} />
                            <div className={styles.main} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
