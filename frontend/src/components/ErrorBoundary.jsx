import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-8 bg-gray-800 border-2 border-red-500/50 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] max-w-lg w-full">
                        <h1 className="text-3xl font-black text-white mb-4">SYSTEM ANOMALY DETECTED</h1>
                        <p className="text-gray-300 font-medium mb-6">
                            A critical failure occurred while rendering this module. Our engineers have been pinged.
                        </p>
                        <div className="bg-black/50 p-4 rounded-lg overflow-x-auto text-left mb-6 font-mono text-sm text-red-400">
                            {this.state.error && this.state.error.toString()}
                        </div>
                        <button
                            className="btn-glow !bg-red-600 !border-red-500 hover:!bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] w-full py-3"
                            onClick={() => window.location.href = '/'}
                        >
                            Reboot Terminal
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
