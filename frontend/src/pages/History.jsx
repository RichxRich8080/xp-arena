import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSetups, deleteSetup } from '../utils/storage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Trash2, Smartphone, Target, ChevronRight, Zap } from 'lucide-react';

export default function History() {
    const navigate = useNavigate();
    const setups = getSetups();

    const handleDelete = (id) => {
        if (confirm('Delete this record from Forge history?')) {
            deleteSetup(id);
            window.location.reload();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12 animate-slide-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                    Forge <span className="text-neon-cyan">History</span>
                </h1>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3 text-neon-cyan" />
                    Reviewing your hardware-optimized signatures
                </p>
            </div>

            <div className="space-y-4">
                {setups.length > 0 ? (
                    setups.map((setup, index) => {
                        // Calculate delta if there's a previous setup for the same device
                        const previous = setups.slice(index + 1).find(s =>
                            s.formData?.brand === setup.formData?.brand &&
                            s.formData?.model === setup.formData?.model
                        );

                        const sensDelta = previous ? (setup.formData?.currentSens - previous.formData?.currentSens).toFixed(1) : null;
                        const isImproved = sensDelta !== null && Math.abs(sensDelta) > 0;

                        return (
                            <Card
                                key={setup.id}
                                glass
                                className="bg-[#0b0f1a]/60 border-gray-800/50 hover:border-neon-cyan/30 transition-all p-0 overflow-hidden group shadow-2xl"
                            >
                                <div className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 group-hover:border-neon-cyan/30 transition-colors">
                                            <Smartphone className="w-6 h-6 text-neon-cyan" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-sm uppercase tracking-tight">
                                                    {setup.formData?.brand} {setup.formData?.model}
                                                </h3>
                                                <span className="text-[10px] text-gray-500 font-mono uppercase">#{setup.id.split('-')[1].slice(-4)}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1 text-axp-gold">
                                                    <Target className="w-3 h-3" /> {setup.formData?.playStyle}
                                                </span>
                                                <span className="border-l border-gray-800 pl-3">
                                                    {new Date(setup.timestamp).toLocaleDateString()}
                                                </span>
                                                {isImproved && (
                                                    <span className="border-l border-gray-800 pl-3 text-neon-green flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" /> CALIBRATED
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="bg-red-500/5 border-red-500/10 hover:bg-red-500/20 hover:border-red-500/40 text-red-500/50 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={() => handleDelete(setup.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="border-gray-800 hover:border-neon-cyan text-gray-400 hover:text-neon-cyan p-2"
                                            onClick={() => navigate('/sensitivity-result', { state: { formData: setup.formData } })}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Delta Indicator */}
                                {sensDelta && (
                                    <div className="px-4 pb-3 flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-gray-950 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-cyan/40 w-[60%] animate-pulse"></div>
                                        </div>
                                        <span className="text-[8px] font-black text-neon-cyan/60 uppercase">Optimization Delta Tracked</span>
                                    </div>
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto border border-gray-800 opacity-20">
                            <Clock className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No forge records found</p>
                            <p className="text-gray-600 text-[10px] uppercase font-medium">Head to the generator to create your first signature.</p>
                        </div>
                        <Button
                            variant="neonCyan"
                            className="mt-6"
                            onClick={() => navigate('/generate-sensitivity')}
                        >
                            Start Generator
                        </Button>
                    </div>
                )}
            </div>

            {/* Global Stats Highlight */}
            {setups.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Card className="bg-neon-cyan/5 border-neon-cyan/20 p-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-neon-cyan/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Zap className="w-4 h-4 text-neon-cyan" />
                            <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">Forge Mastery</span>
                        </div>
                        <p className="text-2xl font-black text-white italic relative z-10">LVL {Math.floor(setups.length / 3) + 1}</p>
                        <p className="text-[8px] text-gray-500 uppercase font-bold relative z-10">{setups.length} Successful Calibrations</p>
                    </Card>
                    <Card className="bg-axp-gold/5 border-axp-gold/20 p-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-axp-gold/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Target className="w-4 h-4 text-axp-gold" />
                            <span className="text-[10px] font-black text-axp-gold uppercase tracking-widest">Consistency</span>
                        </div>
                        <p className="text-2xl font-black text-white italic relative z-10">98.4%</p>
                        <p className="text-[8px] text-gray-500 uppercase font-bold relative z-10">Accuracy Optimization Rate</p>
                    </Card>
                </div>
            )}
        </div>
    );
}
