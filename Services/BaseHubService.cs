using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.JSInterop;
using System.Timers;

public abstract class BaseHubService : IAsyncDisposable
{
    protected HubConnection _hubConnection;
    protected readonly IJSRuntime _jsRuntime;
    protected System.Timers.Timer _timer; // ระบุ namespace ให้ชัดเจน
    protected string _currentTime = DateTime.Now.ToString("HH:mm:ss");

    public bool IsConnected { get; protected set; }
    public string ConnectionStatus { get; protected set; } = "กำลังเชื่อมต่อ...";
    public Dictionary<string, SpotQueueInfo> SpotQueues { get; } = new Dictionary<string, SpotQueueInfo>();

    public event Action OnChange;
    
    // สร้าง public property เพื่อให้เข้าถึงค่า _currentTime
    public string CurrentTime => _currentTime;

    protected BaseHubService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;

        // Initialize timer to update current time every second
        _timer = new System.Timers.Timer(1000); // ระบุ namespace ให้ชัดเจน
        _timer.Elapsed += (sender, e) =>
        {
            _currentTime = DateTime.Now.ToString("HH:mm:ss");
            NotifyStateChanged();
        };
        _timer.Start();
    }

    public abstract Task InitializeAsync();
    
    protected void NotifyStateChanged() => OnChange?.Invoke();

    public async ValueTask DisposeAsync()
    {
        if (_hubConnection != null)
        {
            await _hubConnection.DisposeAsync();
        }
        
        _timer?.Dispose();
    }

    public class SpotQueueInfo
    {
        public string SpotPlace { get; set; }
        public int QueueNumber { get; set; }
        public string PatientName { get; set; }
        public string Department { get; set; }
    }
}