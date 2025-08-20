using System;
using System.Net.Http.Json;
using SoundAnnoucementApp.Dtos.MophAppoint;

namespace SoundAnnoucementApp.Services;

public interface IHospitalSlotService
{
    Task<HospitalSlotResponse?> GetHospitalSlotsAsync(string hospitalCode, int year, int month);
    Task<HospitalScheduleResponse?> GetHospitalSchedulesAsync(string hospitalCode, string date);
    Task<bool> SaveAppointmentAsync(string cid, int scheduleId);
    Task<AppointmentResponse?> GetAppointmentsAsync(string cid); 
    Task<bool> CancelAppointmentAsync(string hospitalCode, string cid, int slotId);
}

// Services/HospitalSlotService.cs
public class HospitalSlotService : IHospitalSlotService
{
    private readonly HttpClient _httpClient;

    public HospitalSlotService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<HospitalScheduleResponse?> GetHospitalSchedulesAsync(string hospitalCode, string date)
    {
        try
        {
            var url = $"http://10.134.50.175:8000/api/Moph/GetHospitalSlotByDate?hcode={hospitalCode}&date={date}";
            return await _httpClient.GetFromJsonAsync<HospitalScheduleResponse>(url);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching hospital schedules: {ex.Message}");
            return null;
        }
    }

    public async Task<HospitalSlotResponse?> GetHospitalSlotsAsync(string hospitalCode, int year, int month)
    {
        try
        {
            var url = $"http://10.134.50.175:8000/api/Moph/GetHospitalSlot?hospital_code={hospitalCode}&year={year}&month={month}";
            return await _httpClient.GetFromJsonAsync<HospitalSlotResponse>(url);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching hospital slots: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> SaveAppointmentAsync(string cid, int scheduleId)
    {
        try
        {
            var url = $"http://10.134.50.175:8000/api/Moph/ReserveAppointment?_Cid={cid}&_schedule_id={scheduleId}";

            // Use POST method with empty content as shown in the curl example
            var response = await _httpClient.PostAsync(url, null);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error reserving appointment: {ex.Message}");
            return false;
        }
    }

    public async Task<AppointmentResponse?> GetAppointmentsAsync(string cid)
    {
        try
        {
            var url = $"http://10.134.50.175:8000/api/Moph/GetAppointmentOnline?cid={cid}";
            return await _httpClient.GetFromJsonAsync<AppointmentResponse>(url);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching appointments: {ex.Message}");
            return null;
        }
    }
    
    public async Task<bool> CancelAppointmentAsync(string hospitalCode, string cid, int slotId)
    {
        try
        {
            // API expects GET, returns text/plain
            var url = $"http://10.134.50.175:8000/api/Moph/CancelAppointmentSlot?hcode={hospitalCode}&cid={cid}&slot_id={slotId}";
            var response = await _httpClient.GetAsync(url);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error canceling appointment: {ex.Message}");
            return false;
        }
    }
}