import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch {
            setError('Nieprawidłowy email lub hasło.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Logowanie</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Hasło</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Zaloguj się</button>
        </form>
    );
};

export default LoginForm;

