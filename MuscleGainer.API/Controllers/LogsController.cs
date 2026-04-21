using Domain.Plans;
using Domain.Plans.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MuscleGainer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LogsController : ControllerBase
    {
        private readonly IWeeklyLogService _logService;

        public LogsController(IWeeklyLogService logService)
        {
            _logService = logService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim is null) throw new Exception("User ID not found in token.");
            return int.Parse(claim.Value);
        }

        [HttpPatch("entries/{entryId}")]
        public async Task<IActionResult> UpdateEntry(int entryId, [FromBody] UpdateLogEntryDto dto)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _logService.UpdateLogEntry(entryId, userId, dto);
                if (entry is null) return NotFound(new { message = "Log entry not found." });
                return Ok(entry);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
