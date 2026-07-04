"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Calendar, Loader2, AlertCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"

interface RSVPButtonProps {
    /** Unique event identifier used as the Firestore document key */
    eventId: string
    /** Optional event details used for calendar sync and emails */
    eventDetails?: {
        title: string;
        description: string;
        date?: string;
    }
}

type RSVPState = "idle" | "loading" | "success" | "already_registered" | "error"

export function RSVPButton({ eventId, eventDetails }: RSVPButtonProps) {
    const { user } = useAuth()
    const [state, setState] = useState<RSVPState>("idle")
    const [showConfetti, setShowConfetti] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    /**
     * In-flight ref lock — synchronously set to true before the first await.
     * making duplicate Firestore writes structurally impossible.
     */
    const isSubmitting = useRef(false)

    // ── On mount: restore RSVP state for already-registered users ──────────────
    useEffect(() => {
        if (!user || !eventId) return

        let cancelled = false
        const rsvpRef = doc(db, "events", eventId, "rsvps", user.uid)

        getDoc(rsvpRef).then((snap) => {
            if (!cancelled && snap.exists()) {
                setState("already_registered")
            }
        }).catch(() => {
            // Silently ignore — user will just see the default idle state
        })

        return () => { cancelled = true }
    }, [user, eventId])

    // ── Main RSVP handler ───────────────────────────────────────────────────────
    const handleRSVP = async () => {
        // Guard: block if already in a terminal state
        if (state === "success" || state === "already_registered") return

        // Guard: synchronous in-flight lock — blocks rapid/double clicks
        if (isSubmitting.current) return
        isSubmitting.current = true

        if (!user) {
            setErrorMessage("Please sign in to RSVP.")
            setState("error")
            isSubmitting.current = false
            return
        }

        setState("loading")
        setErrorMessage("")

        try {
            /**
             * Use the user's UID as the document ID so a second write to the
             * same path is a no-op (setDoc with merge:true is idempotent).
             * Even if two requests race to Firestore, the last write wins and
             * the document content is identical — no duplicate counter increments.
             */
            const rsvpRef = doc(db, "events", eventId, "rsvps", user.uid)
            const existing = await getDoc(rsvpRef)

            if (existing.exists()) {
                setState("already_registered")
            } else {
                await setDoc(rsvpRef, {
                    uid: user.uid,
                    name: user.name ?? null,
                    email: user.email ?? null,
                    registeredAt: serverTimestamp(),
                    eventId,
                })
                setState("success")
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 2000)

                // Trigger confirmation email
                fetch('/api/events/rsvp-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, name: user.name, eventId, eventDetails })
                }).catch(err => console.error("Failed to send RSVP email", err));
            }
        } catch (err) {
            console.error("[RSVPButton] Firestore write failed:", err)
            setErrorMessage("Something went wrong. Please try again.")
            setState("error")
        } finally {
            // Always release the lock so the user can retry after an error
            isSubmitting.current = false
        }
    }

    // ── Derived display helpers ─────────────────────────────────────────────────
    const isDisabled = state === "loading" || state === "success" || state === "already_registered"

    const buttonClass = [
        "px-6 py-3 rounded-xl font-semibold transition-all w-full md:w-auto flex items-center justify-center gap-2",
        state === "success" || state === "already_registered"
            ? "bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 cursor-not-allowed"
            : state === "error"
            ? "bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400"
            : state === "loading"
            ? "bg-gradient-to-r from-cyan-500/70 to-purple-500/70 text-white cursor-wait"
            : "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/20",
    ].join(" ")

    const handleDownloadIcs = () => {
        const title = eventDetails?.title || "DevPath Event";
        const desc = eventDetails?.description || "Event Details";
        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//DevPath//NONSGML v1.0//EN\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:${desc}\nDTSTART:20261231T120000Z\nDTEND:20261231T130000Z\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'invite.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails?.title || 'DevPath Event')}&details=${encodeURIComponent(eventDetails?.description || '')}&dates=20261231T120000Z/20261231T130000Z`;

    return (
        <div className="relative flex flex-col items-start gap-2">
            <motion.button
                onClick={handleRSVP}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                aria-disabled={isDisabled}
                aria-live="polite"
                aria-label={
                    state === "loading"
                        ? "Submitting RSVP…"
                        : state === "success"
                        ? "Successfully registered"
                        : state === "already_registered"
                        ? "You have already registered"
                        : "RSVP for this event"
                }
                className={buttonClass}
            >
                {state === "loading" && (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Registering…</span>
                    </>
                )}
                {(state === "success" || state === "already_registered") && (
                    <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>{state === "already_registered" ? "Already Registered" : "Registered!"}</span>
                    </>
                )}
                {(state === "idle" || state === "error") && (
                    <>
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>RSVP Now</span>
                    </>
                )}
            </motion.button>

            {/* Add to Calendar Sync UI */}
            {(state === "success" || state === "already_registered") && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-2 w-full max-w-sm"
                >
                    <p className="text-xs text-muted-foreground ml-1">Add to your calendar:</p>
                    <div className="flex flex-wrap gap-2">
                        <a 
                            href={googleCalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary border border-border transition-colors flex items-center gap-1.5"
                        >
                            <Calendar className="w-3 h-3" />
                            Google Calendar
                        </a>
                        <button 
                            onClick={handleDownloadIcs}
                            className="text-xs px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary border border-border transition-colors flex items-center gap-1.5"
                        >
                            <Calendar className="w-3 h-3" />
                            Download .ics
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Inline error message */}
            <AnimatePresence>
                {state === "error" && errorMessage && (
                    <motion.p
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400"
                    >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Success confetti */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                                left: "50%",
                                top: "50%",
                            }}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [0, 1, 0],
                                x: (Math.random() - 0.5) * 200,
                                y: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 1, delay: i * 0.02 }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
