"use client"
import { motion, useReducedMotion } from "framer-motion"
import { useState, useEffect } from "react"

type EasingFunction = "easeInOut" | "easeIn" | "easeOut" | "linear"

export function AnimatedBackground() {
    const shouldReduceMotion = useReducedMotion()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Reduced blur on mobile for performance
    const blurAmount = isMobile ? 40 : 80
    const easing: EasingFunction = "easeInOut"

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-surface-deep dark:via-black dark:to-black" />

            {/* Floating orbs - reduced blur on mobile */}
            <motion.div
                className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08]"
                style={{
                    background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)',
                    filter: `blur(${blurAmount}px)`,
                    willChange: 'transform',
                }}
                animate={shouldReduceMotion ? undefined : {
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={shouldReduceMotion ? undefined : {
                    duration: 20,
                    repeat: Infinity,
                    ease: easing
                }}
            />

            <motion.div
                className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
                style={{
                    background: 'radial-gradient(circle, rgba(157,78,221,0.4) 0%, transparent 70%)',
                    filter: `blur(${blurAmount + 10}px)`,
                    willChange: 'transform',
                }}
                animate={shouldReduceMotion ? undefined : {
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                }}
                transition={shouldReduceMotion ? undefined : {
                    duration: 25,
                    repeat: Infinity,
                    ease: easing
                }}
            />

            <motion.div
                className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05]"
                style={{
                    background: 'radial-gradient(circle, rgba(255,0,110,0.4) 0%, transparent 70%)',
                    filter: `blur(${blurAmount - 10}px)`,
                    willChange: 'transform',
                }}
                animate={shouldReduceMotion ? undefined : {
                    x: [0, -60, 0],
                    y: [0, -80, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={shouldReduceMotion ? undefined : {
                    duration: 18,
                    repeat: Infinity,
                    ease: easing
                }}
            />
        </div>
    )
}
