import React from 'react';
import { useHUDDepth } from '../hooks/useHUDDepth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const PlaceholderPage = () => {
    const depthRef = useHUDDepth(10);
    const location = useLocation();
    const navigate = useNavigate();
    const slug = location.pathname.split('/')[1] || 'page';
    const title = slug.toUpperCase();

    return (
        <div className="flex flex-col gap-6 text-center py-12">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-900 border-2 border-dashed border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <span className="text-4xl text-cyan-400">⚡</span>
            </div>
            <div>
                <h2 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 tracking-widest mb-2">{title}</h2>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                    This section is not available yet. We are actively building it for a future update.
                </p>
            </div>

            <div
                ref={depthRef}
                className="hud-depth bg-gray-800/80 backdrop-blur-md border border-gray-700/50 p-6 rounded-2xl shadow-xl mt-4 max-w-lg mx-auto w-full"
            >
                <div className="text-xs text-gray-500 font-mono mb-4 border-b border-gray-700 pb-2">STATUS: UNDER DEVELOPMENT</div>
                <div className="h-32 flex items-center justify-center border border-gray-700 rounded-xl bg-gray-900/50">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[11px] text-gray-300 font-semibold">Thanks for checking this feature early.</span>
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
