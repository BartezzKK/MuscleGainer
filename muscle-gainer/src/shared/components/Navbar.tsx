import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1a1a2e] border-b border-[#3a3a5c]">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-lg font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    💪 Muscle Gainer
                </Link>
                {isAuthenticated && (
                    <div className="flex gap-6">
                        <Link to="/dashboard" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/workouts" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Treningi</Link>
                        <Link to="/plans" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Plany</Link>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <span className="text-xs text-[#94a3b8]">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-1.5 text-sm rounded-lg border border-[#3a3a5c] text-[#94a3b8] hover:text-white hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                            Wyloguj
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Logowanie</Link>
                        <Link to="/register" className="text-sm px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Rejestracja</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
