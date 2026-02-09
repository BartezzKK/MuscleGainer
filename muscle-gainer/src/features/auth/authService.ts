import { api } from "../../api/axios";
import { type LoginRequest, type AuthResponse } from "./types";

export const authService = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>("/auth/login", data),

    register: (data: LoginRequest) =>
        api.post<AuthResponse>("/auth/register", data),
}