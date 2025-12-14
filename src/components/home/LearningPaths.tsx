import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import styles from './LearningPaths.module.css';

const paths = [
    {
        title: "Full Stack React",
        difficulty: "Intermediate",
        duration: "12 weeks",
        modules: 24,
        color: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        highlights: ["Next.js App Router", "Server Actions", "PostgreSQL & Prisma"],
        students: 12500
    },
    {
        title: "Python for AI",
        difficulty: "Advanced",
        duration: "16 weeks",
        modules: 32,
        color: "linear-gradient(135deg, #f59e0b, #b45309)",
        highlights: ["PyTorch Fundamentals", "Neural Networks", "LLM Integration"],
        students: 8400
    },
    {
        title: "DevOps Mastery",
        difficulty: "Advanced",
        duration: "14 weeks",
        modules: 28,
        color: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        highlights: ["Docker & Kubernetes", "CI/CD Pipelines", "AWS Infrastructure"],
        students: 6200
    },
    {
        title: "Web3 Development",
        difficulty: "Beginner",
        duration: "10 weeks",
        modules: 20,
        color: "linear-gradient(135deg, #10b981, #047857)",
        highlights: ["Solidity Smart Contracts", "Ethers.js", "DApp Architecture"],
        students: 4500
    }
];

export default function LearningPaths() {
    return (
        <section className={styles.learningPaths}>
            <div className={styles.header}>
                <h2 className={styles.title}>Structured Learning Paths</h2>
                <p className={styles.subtitle}>
                    Follow expert-curated curriculums designed to take you from zero to mastery.
                </p>
            </div>

            <div className={styles.carousel}>
                {paths.map((path, index) => (
                    <div
                        key={index}
                        className={styles.pathCard}
                        style={{ background: path.color }}
                    >
                        <div>
                            <span className={styles.badge}>{path.difficulty}</span>
                            <h3 className={styles.pathTitle}>{path.title}</h3>

                            <div className={styles.pathMeta}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> {path.duration}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <BookOpen size={14} /> {path.modules} modules
                                </span>
                            </div>

                            <div className={styles.highlights}>
                                {path.highlights.map((highlight, i) => (
                                    <div key={i} className={styles.highlight}>{highlight}</div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.students}>
                                <div className={styles.studentAvatar} />
                                <div className={styles.studentAvatar} style={{ marginLeft: '-10px' }} />
                                <div className={styles.studentAvatar} style={{ marginLeft: '-10px' }} />
                                <span className={styles.studentCount}>+{path.students.toLocaleString()} enrolled</span>
                            </div>

                            <Button variant="ghost" className="!p-2 !bg-white/20 hover:!bg-white/30 !text-white">
                                <ArrowRight size={20} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
