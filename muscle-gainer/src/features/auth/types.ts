import { type UserDto } from "../../shared/types/user";
export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse{
    accessToken: string;
    user: UserDto;
}