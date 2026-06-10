using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace _10000RPGGames.Models
{
    public class Character
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public int Level { get; set; } = 1;

        public int Experience { get; set; } = 0;

        public int Gold { get; set; } = 0;

        public int CurrentLocationId { get; set; }

        [ForeignKey("CurrentLocationId")]
        [JsonIgnore]
        public virtual Location? CurrentLocation { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
