import { FileText, Video, Code, Terminal, Book, ArrowRight, Star } from 'lucide-react';
import styles from './Resources.module.css';

const resources = [
    {
        title: "Documentation Hub",
        description: "Comprehensive guides and API references for all supported technologies and frameworks.",
        icon: <FileText size={28} />,
        color: "#3b82f6",
        rating: 4.9
    },
    {
        title: "Video Tutorials",
        description: "High-quality video courses covering everything from basics to advanced system design.",
        icon: <Video size={28} />,
        color: "#ef4444",
        rating: 4.8
    },
    {
        title: "Coding Challenges",
        description: "Practice your skills with daily algorithmic problems and real-world coding tasks.",
        icon: <Code size={28} />,
        color: "#10b981",
        rating: 4.9
    },
    {
        title: "Cheat Sheets",
        description: "Quick reference cards for syntax, commands, and best practices across 20+ languages.",
        icon: <Terminal size={28} />,
        color: "#f59e0b",
        rating: 4.7
    },
    {
        title: "Interview Prep",
        description: "Mock interviews, system design questions, and behavioral guides to land your dream job.",
        icon: <Book size={28} />,
        color: "#8b5cf6",
        rating: 5.0
    },
    {
        title: "Open Source",
        description: "Curated list of beginner-friendly open source projects to start contributing to today.",
        icon: <Star size={28} />,
        color: "#ec4899",
        rating: 4.8
    }
];

export default function Resources() {
    return (
        <section className={styles.resources}>
            <div className={styles.header}>
                <h2 className={styles.title}>Developer Resources</h2>
                <p className={styles.subtitle}>
                    Curated tools and materials to support your development journey.
                </p>
            </div>

            <div className={styles.grid}>
                {resources.map((resource, index) => (
                    <div key={index} className={styles.resourceCard}>
                        <div
                            className={styles.iconWrapper}
                            style={{ background: resource.color }}
                        >
                            {resource.icon}
                        </div>

                        <h3 className={styles.resourceTitle}>{resource.title}</h3>
                        <p className={styles.resourceDesc}>{resource.description}</p>

                        <div className={styles.footer}>
                            <div className={styles.rating}>
                                <Star size={16} fill="currentColor" />
                                {resource.rating}
                            </div>

                            <button className={styles.action}>
                                Access Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
