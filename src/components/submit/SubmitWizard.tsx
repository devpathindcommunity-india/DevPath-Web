"use client";

import { useState } from 'react';
import { Check, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import styles from './SubmitWizard.module.css';

const steps = ['Details', 'Tech Stack', 'Media', 'Review'];

export default function SubmitWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsSubmitted(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (isSubmitted) {
        return (
            <section className={styles.wizard}>
                <div className={styles.container}>
                    <div className={styles.formCard}>
                        <div className={styles.success}>
                            <div className={styles.successIcon}>
                                <Check size={40} />
                            </div>
                            <h2 className={styles.title}>Project Submitted!</h2>
                            <p className={styles.subtitle}>
                                Your project has been successfully submitted for review.
                                It will be live on the showcase within 24 hours.
                            </p>
                            <Button variant="primary" className="mt-8" onClick={() => window.location.href = '/'}>
                                Return Home
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.wizard}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Submit Your Project</h1>
                    <p className={styles.subtitle}>Share your work with the community and get feedback.</p>
                </div>

                <div className={styles.progress}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`${styles.step} ${index === currentStep ? styles.activeStep :
                                    index < currentStep ? styles.completedStep : ''
                                }`}
                        >
                            {index < currentStep ? <Check size={20} /> : index + 1}
                        </div>
                    ))}
                </div>

                <div className={styles.formCard}>
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Project Title</label>
                                <input type="text" className={styles.input} placeholder="e.g. AI Code Assistant" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description</label>
                                <textarea className={styles.textarea} placeholder="Describe your project..." />
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Primary Language</label>
                                <select className={styles.select}>
                                    <option>JavaScript</option>
                                    <option>Python</option>
                                    <option>Go</option>
                                    <option>Rust</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Frameworks</label>
                                <input type="text" className={styles.input} placeholder="e.g. React, Next.js, Django" />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Project Thumbnail</label>
                                <div className={styles.uploadArea}>
                                    <Upload size={32} style={{ margin: '0 auto 16px', color: 'var(--text-secondary)' }} />
                                    <p style={{ color: 'var(--text-secondary)' }}>Drag and drop or click to upload</p>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Demo URL</label>
                                <input type="url" className={styles.input} placeholder="https://" />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className={styles.label}>Review Details</h3>
                            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>Please verify all information before submitting.</p>
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
                        >
                            <ArrowLeft size={20} /> Back
                        </Button>
                        <Button variant="primary" onClick={handleNext}>
                            {currentStep === steps.length - 1 ? 'Submit Project' : 'Next Step'} <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
