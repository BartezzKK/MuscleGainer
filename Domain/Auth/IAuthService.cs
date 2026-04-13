using Domain.Auth.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
    }
}
