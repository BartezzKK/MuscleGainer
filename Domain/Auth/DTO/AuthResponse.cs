using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Auth.DTO
{
    public class AuthResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public UserDTO User { get; set; } = null!;
    }
}
