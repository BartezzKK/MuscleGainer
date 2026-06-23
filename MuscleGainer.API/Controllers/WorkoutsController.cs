using Domain.Workouts;
using Domain.Workouts.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MuscleGainer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkoutsController : ControllerBase
    {
        private readonly IWorkoutService _workoutService;

        public WorkoutsController(IWorkoutService workoutService)
        {
            _workoutService = workoutService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim is null)
                throw new Exception("User ID not found in token.");
            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkouts()
        {
            var userId = GetUserId();
            var workouts = await _workoutService.GetUserWorkouts(userId);
            return Ok(workouts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkout(int id)
        {
            var userId = GetUserId();
            var workout = await _workoutService.GetWorkoutById(id, userId);
            if (workout is null)
                return NotFound(new { message = "Workout not found." });
            return Ok(workout);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWorkout([FromBody] CreateWorkoutRequest request)
        {
            try
            {
                var userId = GetUserId();
                var workout = await _workoutService.CreateWorkout(userId, request);
                return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("from-plan-day/{planDayId}")]
        public async Task<IActionResult> CreateFromPlanDay(int planDayId, [FromQuery] DateTime? date = null)
        {
            try
            {
                var userId = GetUserId();
                var workout = await _workoutService.CreateWorkoutFromPlanDay(userId, planDayId, date);
                return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/exercises")]
        public async Task<IActionResult> AddExercise(int id, [FromBody] AddExerciseRequest request)
        {
            try
            {
                var userId = GetUserId();
                var workout = await _workoutService.AddExercise(id, userId, request);
                return Ok(workout);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("exercises/{id}/sets")]
        public async Task<IActionResult> AddSet(int id, [FromBody] AddSetRequest request)
        {
            try
            {
                var userId = GetUserId();
                var exercise = await _workoutService.AddSet(id, userId, request);
                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            try
            {
                var userId = GetUserId();
                await _workoutService.DeleteWorkout(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
