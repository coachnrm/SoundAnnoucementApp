using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class HospitalSchedule
{
    [JsonPropertyName("schedule_id")]
    public int ScheduleId { get; set; }
    
    [JsonPropertyName("department_id")]
    public int DepartmentId { get; set; }
    
    [JsonPropertyName("department_name")]
    public string DepartmentName { get; set; } = string.Empty;
    
    [JsonPropertyName("room_id")]
    public int RoomId { get; set; }
    
    [JsonPropertyName("room_name")]
    public string RoomName { get; set; } = string.Empty;
    
    [JsonPropertyName("appointment_type_name")]
    public string AppointmentTypeName { get; set; } = string.Empty;
    
    [JsonPropertyName("time_start")]
    public string TimeStart { get; set; } = string.Empty;
    
    [JsonPropertyName("time_finish")]
    public string TimeFinish { get; set; } = string.Empty;
    
    [JsonPropertyName("available_slot")]
    public int AvailableSlot { get; set; }
}
