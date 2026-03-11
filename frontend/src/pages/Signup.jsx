import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { UserPlus } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.username, formData.email, formData.password);
            addNotification(
                'Areni Registered',
                'Account created successfully. Please log in to continue.',
                'success'
            );
            navigate('/login');
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err?.message || 'Registration failed. Please try again.');
            setError(msg);
            addNotification('Registration Failed', msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-slide-in">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        <UserPlus className="w-6 h-6 text-gray-900" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">Join Arena</h2>
                    <p className="text-sm text-gray-400 mt-1">Create your Areni profile</p>
                </div>

                <Card hoverEffect={false} className="border-gray-800 bg-gray-900/80 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && <p className="text-red-500 text-xs text-center font-bold mb-2">{error}</p>}

                        <Input
                            label="USERNAME"
                            type="text"
                            placeholder="Your gaming tag"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />

                        <Input
                            label="EMAIL"
                            type="email"
                            placeholder="you@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="PASSWORD"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="CONFIRM PASSWORD"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        <Button
                            type="submit"
                            variant="neonGreen"
                            className="w-full mt-4 py-3 tracking-wider font-extrabold"
                            disabled={isLoading}
                        >
                            {isLoading ? 'CREATING...' : 'BECOME AN ARENI'}
                        </Button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-xs text-gray-400">
                            Already an Areni?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-primary-blue font-bold hover:text-white transition-colors"
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
