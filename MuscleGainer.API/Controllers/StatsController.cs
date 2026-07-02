using Domain.Stats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MuscleGainer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatsController : ControllerBase
    {
        private readonly IStatsService _statsService;

        public StatsController(IStatsService statsService)
        {
            _statsService = statsService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var dashboard = await _statsService.GetDashboard(userId);
            return Ok(dashboard);
        }

        [HttpGet("exercises")]
        public async Task<IActionResult> GetExerciseNames()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var names = await _statsService.GetExerciseNames(userId);
            return Ok(names);
        }

        [HttpGet("progress/{exerciseName}")]
        public async Task<IActionResult> GetExerciseProgress(string exerciseName)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var progress = await _statsService.GetExerciseProgress(userId, exerciseName);
            return Ok(progress);
        }
    }
}
