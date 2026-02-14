import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import Login  from "../features/auth/Login";
export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
            <div>Dashboarid</div>
            </ProtectedRoute >
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
]);
