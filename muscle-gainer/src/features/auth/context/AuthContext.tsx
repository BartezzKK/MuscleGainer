import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { UserDto } from '../../../shared/types/user';

interface AuthContextValue {
    user: UserDto | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem("accessToken");

            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch {
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        localStorage.setItem("accessToken", response.accessToken);
        setToken(response.accessToken);
        setUser(response.user);
    };

    const register = async (email: string, password: string) => {
        const response = await authService.register({ email, password });
        localStorage.setItem("accessToken", response.accessToken);
        setToken(response.accessToken);
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};