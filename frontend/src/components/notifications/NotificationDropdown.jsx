import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, Trophy, Zap, AlertCircle } from 'lucide-react';

const NotificationIcon = ({ type, className }) => {
    switch (type) {
        case 'axp': return <Zap className={`text-amber-500 ${className}`} />;
        case 'success': return <Trophy className={`text-emerald-500 ${className}`} />;
        case 'error': return <AlertCircle className={`text-red-500 ${className}`} />;
        default: return <Bell className={`text-primary ${className}`} />;
    }
};

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, clearAll } = useNotifications();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-400" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 shadow-xl rounded-2xl overflow-hidden z-50 animate-fade-in">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/90 backdrop-blur-sm">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-medium">No new notifications</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="p-4 border-b border-white/5 hover:bg-slate-800/50 transition-colors flex gap-3 items-start"
                                    >
                                        <div className="mt-1">
                                            <NotificationIcon type={notif.type} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                                            <p className="text-[10px] font-medium text-slate-400 mt-1">{notif.message}</p>
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
