using Domain.BodyWeight;
using Domain.BodyWeight.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MuscleGainer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BodyWeightController : ControllerBase
    {
        private readonly IBodyWeightService _bodyWeightService;

        public BodyWeightController(IBodyWeightService bodyWeightService)
        {
            _bodyWeightService = bodyWeightService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim is null)
                throw new Exception("User ID not found in token.");
            return int.Parse(claim.Value);
        }

        [HttpPost]
        public async Task<IActionResult> LogWeight([FromBody] LogBodyWeightRequest request)
        {
            try
            {
                var userId = GetUserId();
                var log = await _bodyWeightService.LogWeight(userId, request);
                return Ok(log);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var userId = GetUserId();
            var history = await _bodyWeightService.GetHistory(userId);
            return Ok(history);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            var userId = GetUserId();
            var latest = await _bodyWeightService.GetLatest(userId);
            return Ok(latest);
        }
    }
}
