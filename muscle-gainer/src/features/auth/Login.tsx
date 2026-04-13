import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log("Logowanie z danymi:", { email });
            await login(email, password);
            console.log('login 1');
            navigate('/');
        } catch (error) {
            alert("bład logowania");
        }
    };

    return(
        <form onSubmit={handleSubmit} >
            <h2>Logowanie</h2>
            <div>
                <label>Email</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <label>Password</label>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit">Zaloguj</button>
        </form>
    );
   
};
export default Login;

