import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hammer, ArrowLeft, Construction, Activity, Cpu, ShieldAlert, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const PlaceholderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const slug = location.pathname.split('/')[1] || 'page';
    const title = slug.toUpperCase();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative font-display">
            {/* Kinetic Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-cyan/2 blur-[200px] pointer-events-none" />
            
            <div className="w-full max-w-4xl space-y-16 relative z-10 text-center">
                 {/* Visual Badge */}
                <div className="relative mx-auto group w-40 h-40">
                    <div className="absolute -inset-4 bg-accent-cyan/20 blur-2xl group-hover:opacity-100 opacity-40 transition-opacity animate-pulse" />
                    <Card className="w-full h-full rounded-[3.5rem] border-2 border-dashed border-accent-cyan/40 bg-background flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                         <Hammer className="w-20 h-20 text-accent-cyan animate-bounce" />
                    </Card>
                    <div className="absolute -top-4 -right-4 bg-accent-rose text-white p-3 rounded-2xl shadow-2xl">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-center gap-6">
                         <div className="h-1px w-12 bg-white/10" />
                         <span className="text-[11px] font-black italic text-accent-cyan uppercase tracking-[0.5em]">System_Maintenance_Mode</span>
                         <div className="h-1px w-12 bg-white/10" />
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black italic text-white tracking-tighter uppercase leading-none">
                        NODE <span className="text-accent-cyan text-glow-cyan">OFFLINE</span>
                    </h1>
                    
                    <div className="max-w-2xl mx-auto p-8 glass-panel border-white/5 bg-white/[0.01] rounded-[2.5rem] space-y-4">
                        <div className="text-xl font-black text-white italic tracking-tighter uppercase">{title}_PROTCOL_UNDER_CONSTRUCTION</div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
                           Our system architects are currently synchronizing this node with the global Arena infrastructure. Please check back in a future cycle for high-fidelity access.
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
                             <stat.icon className="w-6 h-6 text-gray-700" />
                             <div className="space-y-0.5">
                                <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest block">{stat.label}</span>
                                <span className="text-[11px] font-black text-white italic uppercase tracking-tighter">{stat.val}</span>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-10">
                    <Button 
                        onClick={() => navigate('/dashboard')}
                        className="px-16 py-8 bg-white text-background font-black uppercase italic tracking-[0.4em] text-[11px] shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        RETURN_TO_COMMAND_CENTER
                    </Button>
                    
                    <div className="flex items-center gap-6 opacity-20">
                         <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.6em]">ESTABLISHED_IDENTITY_v8.4.2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
