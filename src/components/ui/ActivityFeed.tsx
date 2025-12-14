"use client";

import { useRealTime } from '@/context/RealTimeContext';
import { Zap } from 'lucide-react';

export default function ActivityFeed() {
    const { activities } = useRealTime();

    if (activities.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            pointerEvents: 'none'
        }}>
            {activities.map((activity, index) => (
                <div
                    key={activity.id}
                    style={{
                        background: 'rgba(15, 20, 25, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        animation: 'slideInLeft 0.3s ease-out',
                        opacity: 1 - (index * 0.2),
                        transform: `scale(${1 - (index * 0.05)})`,
                        transformOrigin: 'bottom left'
                    }}
                >
                    <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px'
                    }}>
                        <Zap size={12} color="white" />
                    </div>
                    <div style={{ fontSize: '13px' }}>
                        <span style={{ fontWeight: 600 }}>{activity.user}</span> {activity.action} <span style={{ color: '#9ca3af' }}>{activity.target}</span>
                    </div>
                </div>
            ))}
            <style jsx>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
