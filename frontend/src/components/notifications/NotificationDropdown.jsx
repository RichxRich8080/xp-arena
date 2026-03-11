import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, Trophy, Zap, AlertCircle } from 'lucide-react';

const NotificationIcon = ({ type, className }) => {
    switch (type) {
        case 'axp': return <Zap className={`text-axp-gold ${className}`} />;
        case 'success': return <Trophy className={`text-neon-green ${className}`} />;
        case 'error': return <AlertCircle className={`text-red-500 ${className}`} />;
        default: return <Bell className={`text-primary-blue ${className}`} />;
    }
};

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, clearAll } = useNotifications();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
                <Bell className="w-6 h-6 text-gray-300" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden z-50 animate-slide-in">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/90 backdrop-blur-sm">
                            <h3 className="font-bold text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-primary-blue hover:text-cyan-400 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="p-4 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors flex gap-3 items-start"
                                    >
                                        <div className="mt-1">
                                            <NotificationIcon type={notif.type} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-200">{notif.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
