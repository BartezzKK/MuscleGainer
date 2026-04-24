import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Hasła nie są identyczne');
            return;
        }

        try {
            await register(email, password);
            navigate('/dashboard');
        } catch {
            setError('Błąd rejestracji. Email może być już zajęty.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] px-4">
            <div className="w-full max-w-md bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Rejestracja
                </h2>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-[#3b1414] text-[#f87171] text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[#94a3b8]">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="twoj@email.com"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#252540] border border-[#3a3a5c] text-white placeholder-[#94a3b8] focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[#94a3b8]">Hasło</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#252540] border border-[#3a3a5c] text-white placeholder-[#94a3b8] focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[#94a3b8]">Potwierdź hasło</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-[#252540] border border-[#3a3a5c] text-white placeholder-[#94a3b8] focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base transition-colors cursor-pointer"
                    >
                        Zarejestruj się
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
