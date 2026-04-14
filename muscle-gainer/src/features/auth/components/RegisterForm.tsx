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
        <form onSubmit={handleSubmit}>
            <h2>Rejestracja</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Hasło</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Potwierdź hasło</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit">Zarejestruj się</button>
        </form>
    );
};

export default RegisterForm;
