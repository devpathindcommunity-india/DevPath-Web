import { Star, GitFork, Eye } from 'lucide-react';
import styles from './Projects.module.css';

const projects = [
    {
        title: "AI Code Assistant",
        author: "Sarah Chen",
        tags: ["React", "Python", "OpenAI"],
        stats: { stars: 1240, forks: 350, views: "12k" },
        color: "#3b82f6"
    },
    {
        title: "DeFi Dashboard",
        author: "Mike Johnson",
        tags: ["Vue", "Web3", "Solidity"],
        stats: { stars: 850, forks: 120, views: "8k" },
        color: "#10b981"
    },
    {
        title: "Real-time Chat App",
        author: "Alex Rivera",
        tags: ["Next.js", "Socket.io"],
        stats: { stars: 2100, forks: 500, views: "25k" },
        color: "#8b5cf6"
    },
    {
        title: "E-commerce Platform",
        author: "Emily Zhang",
        tags: ["Angular", "Node.js"],
        stats: { stars: 980, forks: 230, views: "10k" },
        color: "#f59e0b"
    },
    {
        title: "DevOps Pipeline Tool",
        author: "David Kim",
        tags: ["Go", "Docker", "K8s"],
        stats: { stars: 1500, forks: 400, views: "15k" },
        color: "#ec4899"
    },
    {
        title: "Mobile Fitness App",
        author: "Lisa Park",
        tags: ["React Native", "Firebase"],
        stats: { stars: 3200, forks: 800, views: "40k" },
        color: "#6366f1"
    }
];

export default function Projects() {
    return (
        <section className={styles.projects}>
            <div className={styles.header}>
                <h2 className={styles.title}>Community Showcase</h2>
                <p className={styles.subtitle}>
                    Discover incredible projects built by developers like you.
                </p>
            </div>

            <div className={styles.grid}>
                {projects.map((project, index) => (
                    <div key={index} className={styles.projectCard}>
                        <div
                            className={styles.thumbnail}
                            style={{
                                background: `linear-gradient(45deg, ${project.color}, #1a1f35)`,
                                opacity: 0.8
                            }}
                        />

                        <div className={styles.overlay}>
                            <div className={styles.author}>
                                <div className={styles.avatar} />
                                <span className={styles.authorName}>{project.author}</span>
                            </div>

                            <h3 className={styles.projectTitle}>{project.title}</h3>

                            <div className={styles.tags}>
                                {project.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>

                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <Star size={14} /> {project.stats.stars}
                                </div>
                                <div className={styles.stat}>
                                    <GitFork size={14} /> {project.stats.forks}
                                </div>
                                <div className={styles.stat}>
                                    <Eye size={14} /> {project.stats.views}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
