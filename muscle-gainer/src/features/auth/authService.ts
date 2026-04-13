import { api } from "../../api/axios";
import { type LoginRequest, type AuthResponse } from "./types";
import type { UserDto } from '../../shared/types/user';

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("auth/Login", data);
        return response.data;

    },

    async register(data: LoginRequest){
//        api.post<AuthResponse>("/auth/register", data),
        const response = await api.post<AuthResponse>("/auth/register", data);
        return response.data;
    },

    async getCurrentUser(): Promise<UserDto> {
    const response = await api.get<UserDto>("/users/me");
    return response.data;
}
};