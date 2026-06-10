using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace _10000RPGGames.Models
{
    public class Location
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public int X { get; set; }

        public int Y { get; set; }

        [MaxLength(500)]
        public string BackgroundImageUrl { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual ICollection<Character> Characters { get; set; } = new List<Character>();
    }
}
