using Domain.Auth.DTO;
using Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace MuscleGainer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService authService;
        private readonly JwtService jwtService;

        public AuthController(AuthService authService, JwtService jwtService)
        {
            this.authService = authService;
            this.jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {


            if(request.Email == "test@test.test" && request.Password == "1qaz")
            {
                var accessToken = jwtService.GenerateToken(request.Email);
                return Ok(new
                {
                    accessToken = accessToken,
                    user = new
                    {
                        id=1,
                        email = "test@test.test"
                    }
                });
            }
            return Unauthorized();

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            return Ok(authService.RegisterAsync(request));
        }
    }


    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
