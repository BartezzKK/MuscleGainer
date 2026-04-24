import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import Layout from "../shared/components/Layout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import WorkoutsPage from "../features/workouts/pages/WorkoutsPage";
import WorkoutDetailPage from "../features/workouts/pages/WorkoutDetailPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import PlansPage from "../features/plans/pages/PlansPage";
import PlanDetailPage from "../features/plans/pages/PlanDetailPage";
import WeeklyLogPage from "../features/plans/pages/WeeklyLogPage";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
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
            {
                path: "/workouts",
                element: (
                    <ProtectedRoute>
                        <WorkoutsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/workouts/:id",
                element: (
                    <ProtectedRoute>
                        <WorkoutDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/plans",
                element: (
                    <ProtectedRoute>
                        <PlansPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/plans/:id",
                element: (
                    <ProtectedRoute>
                        <PlanDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/plans/:id/week",
                element: (
                    <ProtectedRoute>
                        <WeeklyLogPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
