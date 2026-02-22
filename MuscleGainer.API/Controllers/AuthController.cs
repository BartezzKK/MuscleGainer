using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using MuscleGainer.API.Services;

namespace MuscleGainer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService jwtService;

        public AuthController(JwtService jwtService)
        {
            this.jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if(request.Email == "test@test.test" && request.Password == "1qaz")
            {
                var token = jwtService.GenerateToken(request.Email);
                return Ok(new {token});
            }
            return Unauthorized();

        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
