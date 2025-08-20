using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class Appointment
{
    [JsonPropertyName("hospital_appointment_slot_id")]
    public int HospitalAppointmentSlotId { get; set; }
    
    [JsonPropertyName("hospital_code")]
    public string HospitalCode { get; set; } = string.Empty;
    
    [JsonPropertyName("hospital_name")]
    public string HospitalName { get; set; } = string.Empty;
    
    [JsonPropertyName("hospital_department_name")]
    public string HospitalDepartmentName { get; set; } = string.Empty;
    
    [JsonPropertyName("hospital_room_name")]
    public string HospitalRoomName { get; set; } = string.Empty;
    
    [JsonPropertyName("hospital_room_phone_number")]
    public string HospitalRoomPhoneNumber { get; set; } = string.Empty;
    
    [JsonPropertyName("appointment_type_name")]
    public string AppointmentTypeName { get; set; } = string.Empty;
    
    [JsonPropertyName("appointment_date")]
    public string AppointmentDate { get; set; } = string.Empty;
    
    [JsonPropertyName("queue_no")]
    public string QueueNo { get; set; } = string.Empty;
    
    [JsonPropertyName("time_start")]
    public string TimeStart { get; set; } = string.Empty;
    
    [JsonPropertyName("time_finish")]
    public string TimeFinish { get; set; } = string.Empty;
    
    [JsonPropertyName("appointment_datetime")]
    public DateTime AppointmentDatetime { get; set; }
    
    [JsonPropertyName("staff_name")]
    public string StaffName { get; set; } = string.Empty;
    
    [JsonPropertyName("hospital_confirm")]
    public bool HospitalConfirm { get; set; }
    
    [JsonPropertyName("hospital_confirm_staff")]
    public string HospitalConfirmStaff { get; set; } = string.Empty;
    
    [JsonPropertyName("hospital_confirm_datetime")]
    public string HospitalConfirmDatetime { get; set; } = string.Empty;
}
