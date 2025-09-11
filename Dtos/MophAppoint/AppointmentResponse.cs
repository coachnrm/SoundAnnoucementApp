using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class AppointmentResponse
{
    [JsonPropertyName("result")]
    public AppointmentResult Result { get; set; } = new();
    
    [JsonPropertyName("messageCode")]
    public int MessageCode { get; set; }
    
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
    
    [JsonPropertyName("requestTime")]
    public DateTime RequestTime { get; set; }
    
    [JsonPropertyName("endpointIP")]
    public string EndpointIP { get; set; } = string.Empty;
    
    [JsonPropertyName("endpointPort")]
    public int EndpointPort { get; set; }
    
    [JsonPropertyName("processing_ms")]
    public int ProcessingMs { get; set; }
    
    [JsonPropertyName("req_rate")]
    public int ReqRate { get; set; }
}
