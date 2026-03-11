import React, { useState, useCallback } from 'react';
import { NotificationContext } from './contexts';

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((title, message, type = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);

        setNotifications(prev => [
            { id, title, message, type, time: new Date() },
            ...prev
        ].slice(0, 50));

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
