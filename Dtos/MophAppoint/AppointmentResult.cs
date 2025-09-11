using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class AppointmentResult
{
    [JsonPropertyName("person")]
    public Person Person { get; set; } = new();
    
    [JsonPropertyName("appointments")]
    public List<Appointment> Appointments { get; set; } = new();
}
