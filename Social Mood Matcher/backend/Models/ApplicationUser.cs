using Microsoft.AspNetCore.Identity;

namespace SocialMoodMatcher.API.Models;

public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string AvatarColor { get; set; } = "#6C63FF"; // default color for avatar initial
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserMood> Moods { get; set; } = new List<UserMood>();
}
