import { Flame, Trophy, Medal } from 'lucide-react';
import Link from 'next/link';
import styles from './Leaderboard.module.css';

const leaders = [
    { rank: 1, username: "Alex Chen", xp: "125,400", streak: 145, badges: 24 },
    { rank: 2, username: "Sarah Miller", xp: "118,200", streak: 89, badges: 18 },
    { rank: 3, username: "David Kumar", xp: "112,800", streak: 112, badges: 21 },
    { rank: 4, username: "Emily Zhang", xp: "98,500", streak: 45, badges: 15 },
    { rank: 5, username: "Michael Ross", xp: "95,200", streak: 67, badges: 12 },
];

export default function Leaderboard() {
    return (
        <section className={styles.leaderboard}>
            <div className={styles.header}>
                <h2 className={styles.title}>Top Developers</h2>
                <p className={styles.subtitle}>
                    Compete with the best and showcase your progress to the world.
                </p>
            </div>

            <div className={styles.container}>
                <div className={styles.list}>
                    {leaders.map((user) => (
                        <div key={user.rank} className={`${styles.row} ${user.rank <= 3 ? styles[`rank${user.rank}`] : ''}`}>
                            <div className={`${styles.rank} ${user.rank <= 3 ? styles[`rank${user.rank}`] : ''}`}>
                                {user.rank}
                            </div>

                            <div className={styles.user}>
                                <div className={styles.avatar} />
                                <span className={styles.username}>{user.username}</span>
                            </div>

                            <div className={styles.stats}>
                                <div className={styles.streak}>
                                    <Flame size={16} fill="currentColor" />
                                    {user.streak}
                                </div>
                                <div className={styles.xp}>{user.xp} XP</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.currentUser}>
                    <div className={styles.row} style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                        <div className={styles.rank}>42</div>
                        <div className={styles.user}>
                            <div className={styles.avatar} />
                            <span className={styles.username}>You</span>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.streak}>
                                <Flame size={16} fill="currentColor" />
                                12
                            </div>
                            <div className={styles.xp}>4,500 XP</div>
                        </div>
                    </div>
                </div>

                <Link href="/leaderboard" className={styles.viewAll}>
                    View Full Leaderboard
                </Link>
            </div>
        </section>
    );
}
