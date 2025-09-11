using System;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class HospitalSlotResponse
{
    public List<HospitalSlot> Result { get; set; } = new();
    public int MessageCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime RequestTime { get; set; }
    public string EndpointIP { get; set; } = string.Empty;
    public int EndpointPort { get; set; }
    public int ProcessingMs { get; set; }
    public int ReqRate { get; set; }
}
