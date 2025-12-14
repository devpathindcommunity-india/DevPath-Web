import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Send } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <h3>
                            <Image src="/logo.png" alt="DevPath Logo" width={32} height={32} style={{ marginRight: '12px' }} />
                            DevPath
                        </h3>
                        <p className={styles.tagline}>
                            Empowering developers to master their craft through structured learning,
                            real-world projects, and a supportive community.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>Resources</h4>
                        <div className={styles.links}>
                            <Link href="/wiki" className={styles.link}>Wiki</Link>
                            <Link href="/backups" className={styles.link}>Backups</Link>
                            <Link href="/flags" className={styles.link}>Flags</Link>
                            <Link href="/contributors" className={styles.link}>Contributors</Link>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h4>Links</h4>
                        <div className={styles.links}>
                            <Link href="/updater" className={styles.link}>Updater</Link>
                            <Link href="/download" className={styles.link}>Download</Link>
                            <Link href="/source" className={styles.link}>Source Code</Link>
                            <Link href="/translate" className={styles.link}>Translate</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        Developed with ❤️ by FounderName
                    </p>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon} aria-label="GitHub">
                            <Github size={20} />
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Telegram">
                            <Send size={20} />
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Twitter">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
