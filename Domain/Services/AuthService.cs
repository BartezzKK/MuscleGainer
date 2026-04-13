using Domain.Auth;
using Domain.Auth.DTO;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext context;
        private readonly JwtService jwtService;

        public AuthService(AppDbContext context, JwtService jwtService)
        {
            this.context = context;
            this.jwtService = jwtService;
        }


        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser= await context.Users.AnyAsync(u => u.Email == request.Email);
            if (existingUser)
            {
                throw new Exception("User with this email exists.");
            }
             var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var token = jwtService.GenerateToken(user);
            return new AuthResponse
            {
                AccessToken = token,
                User = new UserDTO
                {
                    Id = user.Id,
                    Email = user.Email
                }
            };
        }
    }
}
