using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _10000RPGGames.Data;
using _10000RPGGames.Models;

namespace _10000RPGGames.Controllers
{
    [ApiController]
    [Route("api/game")]
    public class CharactersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CharactersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/game/character/{id}
        [HttpGet("character/{id}")]
        public async Task<ActionResult<Character>> GetCharacter(int id)
        {
            var character = await _context.Characters
                .Include(c => c.CurrentLocation)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (character == null)
            {
                return NotFound(new { message = "Character not found" });
            }

            return character;
        }

// POST: api/game/character/create
        [HttpPost("character/create")]
        public async Task<ActionResult<Character>> CreateCharacter([FromBody] CreateCharacterRequest request)
        {
            // Check if at least one location exists for default placement
            var defaultLocation = await _context.Locations.FirstOrDefaultAsync(l => l.Id == 1);
            
            var character = new Character
            {
                Name = request.Name,
                Level = 1,
                Experience = 0,
                Gold = 0,
                CurrentLocationId = defaultLocation?.Id ?? 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            // Load the navigation property
            await _context.Entry(character).Reference(c => c.CurrentLocation).LoadAsync();

            return CreatedAtAction(nameof(GetCharacter), new { id = character.Id }, character);
        }

        // POST: api/game/character/move
        [HttpPost("character/move")]
        public async Task<ActionResult<Character>> MoveCharacter([FromBody] MoveRequest request)
        {
            var character = await _context.Characters
                .Include(c => c.CurrentLocation)
                .FirstOrDefaultAsync(c => c.Id == request.CharacterId);

            if (character == null)
            {
                return NotFound(new { message = "Character not found" });
            }

            // Validate destination location
            var destinationLocation = await _context.Locations.FindAsync(request.TargetLocationId);
            if (destinationLocation == null)
            {
                return BadRequest(new { message = "Invalid destination location" });
            }

            // Check if already at the same location
            if (character.CurrentLocationId == request.TargetLocationId)
            {
                return BadRequest(new { message = "Character is already at this location" });
            }

            // Update location
            var previousLocationId = character.CurrentLocationId;
            character.CurrentLocationId = request.TargetLocationId;
            character.UpdatedAt = DateTime.UtcNow;

            // Award EXP for movement (default: +10 EXP)
            int expGained = 10;
            character.Experience += expGained;

            // Check for level up: EXP >= Level * 100
            int expNeeded = character.Level * 100;
            while (character.Experience >= expNeeded)
            {
                character.Experience -= expNeeded;
                character.Level++;
                expNeeded = character.Level * 100;
            }

            await _context.SaveChangesAsync();

            // Reload the navigation property
            await _context.Entry(character).Reference(c => c.CurrentLocation).LoadAsync();

            return Ok(new
            {
                character.Id,
                character.Name,
                character.Level,
                character.Experience,
                character.Gold,
                character.CurrentLocationId,
                CurrentLocation = character.CurrentLocation,
                PreviousLocationId = previousLocationId,
                ExpGained = expGained,
                Message = $"Moved to {destinationLocation.Name} and gained {expGained} EXP"
            });
        }
    }

    public class CreateCharacterRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class MoveRequest
    {
        public int CharacterId { get; set; }
        public int TargetLocationId { get; set; }
    }
}
