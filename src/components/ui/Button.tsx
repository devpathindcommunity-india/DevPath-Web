import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    children,
    icon,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className || ''}`}
            {...props}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
            <div className={styles.glow} />
        </button>
    );
}
