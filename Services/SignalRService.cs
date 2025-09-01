using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.Components;
using System.Threading.Tasks;

namespace SoundAnnoucementApp.Services
{
    public class SignalRService
    {
        private readonly HubConnection _hubConnection;
        private readonly NavigationManager _navigationManager;

        public SignalRService(HubConnection hubConnection, NavigationManager navigationManager)
        {
            _hubConnection = hubConnection;
            _navigationManager = navigationManager;
        }

        public bool IsConnected => _hubConnection.State == HubConnectionState.Connected;

        public async Task StartConnectionAsync()
        {
            if (_hubConnection.State == HubConnectionState.Disconnected)
            {
                await _hubConnection.StartAsync();
            }
        }

        public async Task StopConnectionAsync()
        {
            if (_hubConnection.State != HubConnectionState.Disconnected)
            {
                await _hubConnection.StopAsync();
            }
        }

        public async Task JoinDepartmentGroup(string departmentId)
        {
            if (IsConnected)
            {
                await _hubConnection.InvokeAsync("JoinDepartmentGroup", departmentId);
            }
        }

        public async Task LeaveDepartmentGroup(string departmentId)
        {
            if (IsConnected)
            {
                await _hubConnection.InvokeAsync("LeaveDepartmentGroup", departmentId);
            }
        }

        public async Task JoinAllQueuesGroup()
        {
            if (IsConnected)
            {
                await _hubConnection.InvokeAsync("JoinAllQueuesGroup");
            }
        }

        public async Task SendQueueUpdate(string message)
        {
            if (IsConnected)
            {
                await _hubConnection.SendAsync("SendQueueUpdate", message);
            }
        }

        public void On<T>(string methodName, Action<T> handler)
        {
            _hubConnection.On(methodName, handler);
        }

        public void On(string methodName, Action handler)
        {
            _hubConnection.On(methodName, handler);
        }
    }
}