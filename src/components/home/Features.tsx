import { Code2, Video, Grid, Bot, Trophy, MessageSquare } from 'lucide-react';
import Card from '../ui/Card';
import styles from './Features.module.css';

const features = [
    {
        icon: <Code2 size={32} />,
        title: "Interactive Code Playground",
        description: "Write, test, and execute code directly in your browser with our advanced Monaco-based editor supporting 20+ languages.",
        color: "linear-gradient(135deg, #3b82f6, #2563eb)"
    },
    {
        icon: <Video size={32} />,
        title: "Live Mentorship Sessions",
        description: "Connect with industry experts for real-time guidance, code reviews, and career advice through high-quality video sessions.",
        color: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
    },
    {
        icon: <Grid size={32} />,
        title: "Project Showcase Gallery",
        description: "Display your best work in a stunning portfolio grid. Get feedback, stars, and recognition from the global developer community.",
        color: "linear-gradient(135deg, #ec4899, #db2777)"
    },
    {
        icon: <Bot size={32} />,
        title: "AI Learning Assistant",
        description: "Get instant answers, code explanations, and personalized learning recommendations from our fine-tuned AI mentor.",
        color: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
        icon: <Trophy size={32} />,
        title: "Gamified Progress",
        description: "Earn XP, unlock badges, and climb the global leaderboard as you complete challenges and master new skills.",
        color: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
        icon: <MessageSquare size={32} />,
        title: "Real-time Community",
        description: "Join vibrant discussions, share knowledge, and collaborate on projects in our topic-based channels and forums.",
        color: "linear-gradient(135deg, #6366f1, #4f46e5)"
    }
];

export default function Features() {
    return (
        <section className={styles.features}>
            <div className={styles.header}>
                <h2 className={styles.title}>DevPath Features</h2>
                <p className={styles.subtitle}>
                    Everything you need to accelerate your growth as a developer,
                    all in one immersive platform.
                </p>
            </div>

            <div className={styles.grid}>
                {features.map((feature, index) => (
                    <Card key={index}>
                        <div
                            className={styles.iconWrapper}
                            style={{ background: feature.color }}
                        >
                            {feature.icon}
                        </div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}
