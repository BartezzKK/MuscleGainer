import { createContext, useContext, useState } from "react";
import { authService } from "./authService";
import type { UserDto } from '../../shared/types/user';
interface AuthContextValue {
    user: UserDto | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;

}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDto | null>(null);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};