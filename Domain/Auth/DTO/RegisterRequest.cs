using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Auth.DTO
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string  Password { get; set; }
    }
}
