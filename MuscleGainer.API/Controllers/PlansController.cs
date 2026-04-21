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
    public class PlansController : ControllerBase
    {
        private readonly ITrainingPlanService _planService;
        private readonly IWeeklyLogService _logService;

        public PlansController(ITrainingPlanService planService, IWeeklyLogService logService)
        {
            _planService = planService;
            _logService = logService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim is null) throw new Exception("User ID not found in token.");
            return int.Parse(claim.Value);
        }


        [HttpGet]
        public async Task<IActionResult> GetPlans()
        {
            var userId = GetUserId();
            var plans = await _planService.GetUserPlans(userId);
            return Ok(plans);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlan(int id)
        {
            var userId = GetUserId();
            var plan = await _planService.GetPlanDetails(id, userId);
            if (plan is null) return NotFound(new { message = "Plan not found." });
            return Ok(plan);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePlan([FromBody] CreatePlanDto dto)
        {
            try
            {
                var userId = GetUserId();
                var plan = await _planService.CreatePlan(userId, dto);
                return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, plan);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] UpdatePlanDto dto)
        {
            var userId = GetUserId();
            var plan = await _planService.UpdatePlan(id, userId, dto);
            if (plan is null) return NotFound(new { message = "Plan not found." });
            return Ok(plan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            var userId = GetUserId();
            var deleted = await _planService.DeletePlan(id, userId);
            if (!deleted) return NotFound(new { message = "Plan not found." });
            return NoContent();
        }

        [HttpPost("{planId}/exercises")]
        public async Task<IActionResult> AddExercise(int planId, [FromBody] AddExerciseDto dto)
        {
            try
            {
                var userId = GetUserId();
                var exercise = await _planService.AddExercise(planId, userId, dto);
                return CreatedAtAction(nameof(GetPlan), new { id = planId }, exercise);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{planId}/exercises/{exerciseId}")]
        public async Task<IActionResult> UpdateExercise(int planId, int exerciseId, [FromBody] UpdateExerciseDto dto)
        {
            var userId = GetUserId();
            var exercise = await _planService.UpdateExercise(planId, exerciseId, userId, dto);
            if (exercise is null) return NotFound(new { message = "Exercise not found." });
            return Ok(exercise);
        }

        [HttpDelete("{planId}/exercises/{exerciseId}")]
        public async Task<IActionResult> DeleteExercise(int planId, int exerciseId)
        {
            var userId = GetUserId();
            var deleted = await _planService.DeleteExercise(planId, exerciseId, userId);
            if (!deleted) return NotFound(new { message = "Exercise not found." });
            return NoContent();
        }

        [HttpPut("{planId}/days/{dayId}")]
        public async Task<IActionResult> UpdateDay(int planId, int dayId, [FromBody] UpdateDayDto dto)
        {
            var userId = GetUserId();
            var day = await _planService.UpdateDay(planId, dayId, userId, dto);
            if (day is null) return NotFound(new { message = "Day not found." });
            return Ok(day);
        }

        [HttpPost("{planId}/days/{dayId}/exercises")]
        public async Task<IActionResult> AssignExerciseToDay(int planId, int dayId, [FromBody] AssignExerciseDto dto)
        {
            var userId = GetUserId();
            var pde = await _planService.AssignExerciseToDay(planId, dayId, userId, dto);
            if (pde is null) return NotFound(new { message = "Plan day or exercise not found." });
            return Ok(pde);
        }

        [HttpDelete("{planId}/days/{dayId}/exercises/{planDayExerciseId}")]
        public async Task<IActionResult> RemoveExerciseFromDay(int planId, int dayId, int planDayExerciseId)
        {
            var userId = GetUserId();
            var removed = await _planService.RemoveExerciseFromDay(planId, dayId, planDayExerciseId, userId);
            if (!removed) return NotFound(new { message = "Assignment not found." });
            return NoContent();
        }

        [HttpGet("{planId}/logs/current")]
        public async Task<IActionResult> GetCurrentWeekLog(int planId)
        {
            try
            {
                var userId = GetUserId();
                var log = await _logService.GetOrCreateCurrentWeekLog(planId, userId);
                return Ok(log);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{planId}/logs")]
        public async Task<IActionResult> GetLogHistory(int planId)
        {
            try
            {
                var userId = GetUserId();
                var logs = await _logService.GetLogHistory(planId, userId);
                return Ok(logs);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
