"use client"
import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, updateDoc, writeBatch, limit } from "firebase/firestore"
import Link from "next/link"

interface Notification {
    id: string
    title: string
    message: string
    image?: string
    createdAt: any
    read: boolean
    type: 'achievement' | 'message' | 'event' | 'system'
}

export function NotificationDropdown() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'members', user.uid, 'notifications'),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
            },
            (error) => {
                console.error("Notification subscription error:", error);
                // Gracefully handle permission errors (e.g. rules not yet deployed)
            }
        );

        return () => unsubscribe();
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = async (id: string) => {
        if (!user) return;
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            await updateDoc(doc(db, 'members', user.uid, 'notifications', id), {
                read: true
            });
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }

    const markAllAsRead = async () => {
        if (!user) return;
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            const batch = writeBatch(db);
            const unread = notifications.filter(n => !n.read);
            if (unread.length === 0) return;

            unread.forEach(n => {
                const ref = doc(db, 'members', user.uid, 'notifications', n.id);
                batch.update(ref, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-xs font-bold flex items-center justify-center animate-pulse text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Notification Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-96 bg-white/95 dark:bg-[#0f1419]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl z-50 max-h-[600px] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="overflow-y-auto max-h-[500px]">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Type Icon */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white ${notif.type === 'achievement' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                    notif.type === 'event' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                                                        notif.type === 'message' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                                            'bg-gradient-to-r from-gray-500 to-gray-600'
                                                    }`}>
                                                    {notif.type === 'achievement' && '🏆'}
                                                    {notif.type === 'event' && '📅'}
                                                    {notif.type === 'message' && '💬'}
                                                    {(!notif.type || notif.type === 'system') && '🔔'}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{notif.title}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {notif.createdAt?.seconds ? new Date(notif.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                    </p>
                                                </div>

                                                {/* Unread Indicator */}
                                                {!notif.read && (
                                                    <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-2" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-black/5 dark:border-white/10 text-center">
                                <Link
                                    href="/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors block w-full"
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
