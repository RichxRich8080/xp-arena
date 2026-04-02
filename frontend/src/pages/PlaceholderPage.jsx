import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hammer, ArrowLeft, Activity, Cpu, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const PlaceholderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const slug = location.pathname.split('/')[1] || 'page';
    const title = slug.toUpperCase();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative font-sans">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />
            
            <div className="w-full max-w-4xl space-y-16 relative z-10 text-center">
                 {/* Visual Badge */}
                <div className="relative mx-auto group w-40 h-40">
                    <div className="absolute -inset-4 bg-primary/10 blur-2xl group-hover:opacity-100 opacity-40 transition-opacity animate-pulse" />
                    <Card className="w-full h-full rounded-[3.5rem] border-2 border-dashed border-primary/20 bg-slate-900/50 flex items-center justify-center transition-all duration-700">
                         <Hammer className="w-16 h-16 text-primary" />
                    </Card>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-center gap-6">
                         <div className="h-px w-12 bg-white/10" />
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.5em]">System Maintenance</span>
                         <div className="h-px w-12 bg-white/10" />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-none">
                        Page <span className="text-primary">Under Construction</span>
                    </h1>
                    
                    <div className="max-w-2xl mx-auto p-8 border border-white/5 bg-slate-900/50 rounded-[2.5rem] text-center space-y-4">
                        <div className="text-xl font-bold text-white tracking-tight uppercase">{title} Module</div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                           Our engineering team is currently building and optimizing this section. Please check back later for updates.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto opacity-40">
                    {[
                        { icon: Activity, label: 'BUILD_PROGRESS', val: '84%' },
                        { icon: Cpu, label: 'CORE_SYNC', val: 'PENDING' },
                        { icon: Zap, label: 'VOLTAGE', val: 'STABLE' }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                             <stat.icon className="w-6 h-6 text-slate-500" />
                             <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block">{stat.label}</span>
                                <span className="text-[11px] font-bold text-white uppercase tracking-tight">{stat.val}</span>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-10">
                    <Button 
                        onClick={() => navigate('/dashboard')}
                        className="px-12 py-6 bg-primary text-slate-950 font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg hover:scale-105 transition-all flex items-center gap-4 group rounded-xl"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        Return to Dashboard
                    </Button>
                    
                    <div className="flex items-center gap-6 opacity-20">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.6em]">System Version 8.4.2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
