using System;

namespace SoundAnnoucementApp.Dtos;

public sealed record WardDto
{
    public string? WardCode { get; init; }
    public string? WardName { get; init; }
}
