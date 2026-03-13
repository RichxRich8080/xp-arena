import React from 'react';
import { Card } from '../ui/Card';
import { Activity, ChevronRight, Zap, Target, Share2 } from 'lucide-react';

export function LiveArenaFeed() {
    const feeds = [
        { id: 1, type: 'forge', user: 'User_04', action: 'Optimized Sensitivity', time: '2m', value: '98.5%', icon: Target, color: 'text-primary' },
        { id: 2, type: 'axp', user: 'Pro_User', action: 'Claimed Daily Reward', time: '5m', value: '+50 Points', icon: Zap, color: 'text-amber-500' },
        { id: 3, type: 'elite', user: 'Elite_Main', action: 'Joined Professional Series', time: '12m', value: 'QUALIFIED', icon: Activity, color: 'text-blue-500' },
        { id: 4, type: 'share', user: 'Recon_S', action: 'Published Report', time: '15m', value: '#1.4K', icon: Share2, color: 'text-emerald-500' },
    ];

    return (
        <aside className="space-y-8 h-full flex flex-col">
            <h2 className="font-bold text-lg text-white tracking-widest uppercase flex items-center gap-4">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
                Live Activity Feed
            </h2>
            
            <Card className="flex-1 p-2 space-y-1 bg-white/[0.01] border-white/[0.03]">
                <div className="custom-scrollbar overflow-y-auto max-h-[400px] pr-2">
                    {feeds.map((f) => (
                        <div key={f.id} className="group/item flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 mb-1 last:mb-0">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:scale-105 transition-transform ${f.color}`}>
                                <f.icon className="w-5 h-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{f.user}</span>
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">• {f.time} ago</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{f.action}</p>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${f.color}`}>{f.value}</span>
                                <ChevronRight className="w-3 h-3 text-slate-600 group-hover/item:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Meta stats link */}
                <div className="p-4 pt-6 mt-4 border-t border-white/5 flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary transition-colors uppercase tracking-[0.2em]">View All Activity</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
            </Card>
        </aside>
    );
}
