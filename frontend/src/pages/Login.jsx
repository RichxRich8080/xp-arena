import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LogIn } from 'lucide-react';
import { systemService } from '../services/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');

    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectReason = location.state?.reason || '';

    const handleSubmit = async (e) => {
        try {
            await systemService.readiness();
            setServiceMessage('');
        } catch (readyErr) {
            setServiceMessage(readyErr?.message || 'Service is not fully ready yet.');
        }
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            addNotification(
                'Welcome Back, Areni',
                `Logged in successfully as ${username}`,
                'success'
            );
            const redirectPath = location.state?.from || '/dashboard';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err?.message || 'Login failed. Please try again.');
            setError(msg);
            addNotification('Login Failed', msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-slide-in">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-blue to-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(30,58,138,0.5)]">
                        <LogIn className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">Arena Access</h2>
                    <p className="text-sm text-gray-400 mt-1">Authenticate to connect</p>
                    {redirectReason && (
                        <p className="mt-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md px-3 py-2">
                            {redirectReason}
                        </p>
                    )}
                    {serviceMessage && (
                        <p className="mt-2 text-xs text-orange-300 bg-orange-500/10 border border-orange-500/30 rounded-md px-3 py-2">
                            {serviceMessage}
                        </p>
                    )}

                </div>

                <Card hoverEffect={false} className="border-gray-800 bg-gray-900/80 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="USERNAME"
                            type="text"
                            placeholder="Enter your gaming tag"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <Input
                            label="PASSWORD"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={error}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full mt-2 py-3 tracking-wider"
                            disabled={isLoading}
                        >
                            {isLoading ? 'AUTHENTICATING...' : 'ENTER ARENA'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            New to XP Arena?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-neon-cyan font-bold hover:underline"
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
