using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.JSInterop;

public class DisplayHubService : BaseHubService
{
    private const string HubUrl = "http://localhost:5041/displayhub";

    public DisplayHubService(IJSRuntime jsRuntime) : base(jsRuntime)
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

            _hubConnection.On<string, int, string, string>("ReceiveQueueUpdate1",
                (spotPlace, queueNumber, patientName, department) =>
            {
                Console.WriteLine($"Received update - Spot: {spotPlace}, Queue: {queueNumber}, Patient: {patientName}, Dept: {department}");

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

            await _hubConnection.StartAsync();
            
            ConnectionStatus = "เชื่อมต่อแล้ว";
            IsConnected = true;
            NotifyStateChanged();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DisplayHub connection error: {ex.Message}");
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
    
}