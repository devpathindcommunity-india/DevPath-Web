"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Video, Code, Terminal, Book, Star, Calendar } from 'lucide-react';
import { PremiumCard } from '../ui/PremiumCard';
import styles from './Resources.module.css';

const resources = [
    {
        id: 'internships',
        label: 'Internships',
        items: [
            {
                title: "Internship Calendar",
                description: "Track upcoming internship opportunities, application deadlines, and eligibility criteria for top tech companies.",
                icon: <Calendar size={28} />,
                color: "#8b5cf6",
                rating: 5.0
            }
        ]
    },
    {
        id: 'learning',
        label: 'Learning',
        items: [
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
                title: "Cheat Sheets",
                description: "Quick reference cards for syntax, commands, and best practices across 20+ languages.",
                icon: <Terminal size={28} />,
                color: "#f59e0b",
                rating: 4.7
            }
        ]
    },
    {
        id: 'practice',
        label: 'Practice',
        items: [
            {
                title: "Coding Challenges",
                description: "Practice your skills with daily algorithmic problems and real-world coding tasks.",
                icon: <Code size={28} />,
                color: "#10b981",
                rating: 4.9
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
        ]
    }
];

export default function ResourcesTabs() {
    const [activeTab, setActiveTab] = useState('internships');

    const activeResources = resources.find(r => r.id === activeTab)?.items || [];

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* WhatsApp-like Tabs */}
            <div className="flex bg-card/50 backdrop-blur-sm border border-border rounded-t-xl overflow-hidden mb-6">
                {resources.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {activeResources.map((resource, index) => (
                        <motion.div
                            key={resource.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <PremiumCard className={`${styles.resourceCard} h-full group`}>
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
                                        Access Now
                                    </button>
                                </div>
                            </PremiumCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
