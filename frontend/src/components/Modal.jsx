import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShow(true), 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative z-10 w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                {/* Header */}
                <div className="bg-slate-800/50 border-b border-white/5 p-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-slate-300">
                    {children}
                </div>

                {/* Bottom Border */}
                <div className="h-1 w-full bg-primary/20"></div>
            </div>
        </div>
    );
};

export default Modal;
