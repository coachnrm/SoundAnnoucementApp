using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.JSInterop;

public class PrescriptionReceiptHubService : BaseHubService
{
    // ใช้ URL ให้ตรงกับ endpoint จริง
    private const string HubUrl = "http://localhost:5082/prescriptionreceiptHub";

    public PrescriptionReceiptHubService(IJSRuntime jsRuntime) : base(jsRuntime)
    {
    }

    public override async Task InitializeAsync()
    {
        try
        {
            ConnectionStatus = "กำลังเชื่อมต่อ...";
            IsConnected = false;
            NotifyStateChanged();

            if (_hubConnection != null)
            {
                await _hubConnection.DisposeAsync();
            }

            _hubConnection = new HubConnectionBuilder()
                .WithUrl(HubUrl)
                .WithAutomaticReconnect(new[] {
                    TimeSpan.Zero,
                    TimeSpan.FromSeconds(2),
                    TimeSpan.FromSeconds(5),
                    TimeSpan.FromSeconds(10)
                })
                .Build();

            // รับข้อมูลจาก Hub - ใช้ method name ที่ถูกต้อง
            _hubConnection.On<string, int, string, string>("ReceiveQueueUpdate2",
                (spotPlace, queueNumber, patientName, department) =>
            {
                // Console.WriteLine($"Received update - Spot: {spotPlace}, Queue: {queueNumber}, Patient: {patientName}, Dept: {department}");

                var spotInfo = new SpotQueueInfo
                {
                    SpotPlace = spotPlace,
                    QueueNumber = queueNumber,
                    PatientName = patientName,
                    Department = department
                };

                SpotQueues[spotPlace] = spotInfo;

                // Announce the queue update with sound
                _ = AnnounceQueue(queueNumber, patientName, department, spotPlace, 0.7, 1.2, 2.0);

                NotifyStateChanged();
            });

            // รับข้อมูลอัปเดตสถานะคิว
            _hubConnection.On<object>("QueueStatusUpdated", (queueData) =>
            {
                // Console.WriteLine($"Queue status updated: {Newtonsoft.Json.JsonConvert.SerializeObject(queueData)}");
                // อาจต้องอัปเดต UI ตามสถานะ
                NotifyStateChanged();
            });

            _hubConnection.On<object>("QueueStatusHxUpdated", (queueData) =>
            {
                // Console.WriteLine($"Queue history status updated: {Newtonsoft.Json.JsonConvert.SerializeObject(queueData)}");
                // อาจต้องอัปเดต UI ตามสถานะ
                NotifyStateChanged();
            });

            _hubConnection.On<object>("QueueStatusGmUpdated", (queueData) =>
            {
                // Console.WriteLine($"Queue GM status updated: {Newtonsoft.Json.JsonConvert.SerializeObject(queueData)}");
                // อาจต้องอัปเดต UI ตามสถานะ
                NotifyStateChanged();
            });

            _hubConnection.Reconnected += (connectionId) =>
            {
                ConnectionStatus = "เชื่อมต่อแล้ว";
                IsConnected = true;
                NotifyStateChanged();
                return Task.CompletedTask;
            };

            _hubConnection.Reconnecting += (exception) =>
            {
                ConnectionStatus = "กำลังเชื่อมต่อใหม่...";
                IsConnected = false;
                NotifyStateChanged();
                return Task.CompletedTask;
            };

            _hubConnection.Closed += (exception) =>
            {
                ConnectionStatus = "การเชื่อมต่อถูกปิด";
                IsConnected = false;
                NotifyStateChanged();
                return Task.CompletedTask;
            };
                // รับข้อมูลอัปเดตสถานะคิว
            _hubConnection.On<object>("QueueStatusUpdated", (queueData) =>
            {
                // อัปเดต UI ตามสถานะ
                NotifyStateChanged();
            });

            _hubConnection.On<object>("QueueStatusGmUpdated", (queueData) =>
            {
                // อัปเดต UI ตามสถานะ
                NotifyStateChanged();
            });

            await _hubConnection.StartAsync();
            
            ConnectionStatus = "เชื่อมต่อแล้ว";
            IsConnected = true;
            NotifyStateChanged();
            
            Console.WriteLine("PrescriptionReceiptHubService connected successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"PrescriptionReceiptHubService connection error: {ex.Message}");
            IsConnected = false;
            ConnectionStatus = "เชื่อมต่อล้มเหลว";
            NotifyStateChanged();
        }
    }

    private async Task AnnounceQueue(int queueNumber, string patientName, string department, string spotPlace, double rate, double pitch, double volume)
    {
        try
        {
            await _jsRuntime.InvokeVoidAsync("audioHelper.announceQueue3",
                queueNumber, patientName, department, spotPlace, rate, pitch, volume);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error announcing queue: {ex.Message}");
        }
    }
    public class CustomRetryPolicy : IRetryPolicy
    {
        public TimeSpan? NextRetryDelay(RetryContext retryContext)
        {
            if (retryContext.PreviousRetryCount >= 5)
                return null; // Stop trying after 5 attempts
            
            return TimeSpan.FromSeconds(Math.Min(30, Math.Pow(2, retryContext.PreviousRetryCount)));
        }
    }
}