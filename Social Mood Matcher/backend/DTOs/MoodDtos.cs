using System.ComponentModel.DataAnnotations;
using SocialMoodMatcher.API.Models;

namespace SocialMoodMatcher.API.DTOs;

public record PostMoodDto(
    [Required] MoodType MoodType,
    [MaxLength(500)] string Description
);

public record MoodResponseDto(
    int Id,
    string UserId,
    string UserDisplayName,
    string UserAvatarColor,
    MoodType MoodType,
    string Description,
    DateTime CreatedAt
);

public record MatchedUserDto(
    string UserId,
    string DisplayName,
    string AvatarColor,
    MoodType CurrentMood,
    string LatestMoodDescription,
    DateTime MoodPostedAt
);
