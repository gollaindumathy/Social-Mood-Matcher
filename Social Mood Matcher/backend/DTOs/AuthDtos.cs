using System.ComponentModel.DataAnnotations;

namespace SocialMoodMatcher.API.DTOs;

public record RegisterDto(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required, MinLength(2)] string DisplayName
);

public record LoginDto(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record AuthResponseDto(
    string Token,
    string UserId,
    string Email,
    string DisplayName,
    string AvatarColor
);

public record UpdateProfileDto(
    string? DisplayName,
    string? Bio,
    string? AvatarColor
);

public record UserProfileDto(
    string Id,
    string Email,
    string DisplayName,
    string Bio,
    string AvatarColor,
    DateTime CreatedAt
);
