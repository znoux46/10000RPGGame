using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _10000RPGGames.Data;
using _10000RPGGames.Models;

namespace _10000RPGGames.Controllers
{
    [ApiController]
    [Route("api/game")]
    public class LocationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/game/locations
        [HttpGet("locations")]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            var locations = await _context.Locations.ToListAsync();
            return Ok(locations);
        }

        // GET: api/game/locations/{id}
        [HttpGet("locations/{id}")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {
                return NotFound(new { message = "Location not found" });
            }

            return Ok(location);
        }
    }
}
