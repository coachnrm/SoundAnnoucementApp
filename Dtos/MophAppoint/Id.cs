using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class Id
{
    [JsonPropertyName("oid")]
    public string Oid { get; set; } = string.Empty;
}
