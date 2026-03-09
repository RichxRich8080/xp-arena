import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
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
            <div className={`relative z-10 w-full max-w-lg bg-gray-900 border border-indigo-500/50 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                {/* Glow Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 p-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-gray-300">
                    {children}
                </div>

                {/* Glowing border bottom effect */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"></div>
            </div>
        </div>
    );
};

export default Modal;
