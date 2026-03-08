namespace SocialMoodMatcher.API.Models;

public enum MoodType
{
    Happy,
    Sad,
    Angry,
    Calm,
    Stressed,
    Excited
}

public class UserMood
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public MoodType MoodType { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
