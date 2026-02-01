import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MaintenanceState {
    isMaintenanceMode: boolean;
    maintenanceMessage: string;
    loading: boolean;
}

export function useMaintenance() {
    const [state, setState] = useState<MaintenanceState>({
        isMaintenanceMode: false,
        maintenanceMessage: '',
        loading: true,
    });

    useEffect(() => {
        // Subscribe to real-time updates from Firestore
        const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setState({
                    isMaintenanceMode: data.maintenanceMode || false,
                    maintenanceMessage: data.maintenanceMessage || 'We are currently under scheduled maintenance. Please check back later.',
                    loading: false,
                });
            } else {
                // If document doesn't exist, assume no maintenance (or handle strictly)
                setState({
                    isMaintenanceMode: false,
                    maintenanceMessage: '',
                    loading: false,
                });
            }
        }, (error) => {
            console.error("Error fetching maintenance status:", error);
            // On error, default to false to avoid locking everyone out due to permission issues if not intended
            setState(prev => ({ ...prev, loading: false }));
        });

        return () => unsubscribe();
    }, []);

    return state;
}
