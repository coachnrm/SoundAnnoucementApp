using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class HospitalSlot
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }
    
    [JsonPropertyName("available_slot")]
    public int AvailableSlot { get; set; }
}
