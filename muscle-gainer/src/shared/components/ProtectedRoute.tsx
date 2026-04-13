import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {type ReactNode } from "react";
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const {isAuthenticated, isLoading } = useAuth();
    console.log("Auth:", isAuthenticated, "Loading:", isLoading);
if(isLoading){
    return <div>Loading....</div>
}
if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
    }
    return <>{children}</>;


};