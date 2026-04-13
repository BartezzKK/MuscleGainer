import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "./authService";
import type { UserDto } from '../../shared/types/user';
interface AuthContextValue {
    user: UserDto | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated:boolean;
    isLoading:boolean;


}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDto | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(()=> {
        const initAuth = async() =>{
            const token = localStorage.getItem("accessToken");

            if(!token){
                setIsLoading(false);
                return;
            }
            try{
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            }
            catch{
                logout();
            }
            finally{
                setIsLoading(false);
            }
        }
        initAuth();
    },[]);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        localStorage.setItem("accessToken", response.accessToken);
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};