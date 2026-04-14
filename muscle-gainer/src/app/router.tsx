import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

const HomePage = () => <div><h1>Muscle Gainer</h1><p>Witaj w aplikacji do zarządzania treningami!</p></div>;
const DashboardPage = () => <div><h1>Dashboard</h1><p>Twoje treningi i postępy</p></div>;

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
]);
