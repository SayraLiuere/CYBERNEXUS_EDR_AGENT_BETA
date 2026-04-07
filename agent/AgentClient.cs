using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace EDR_AGENT_BETA.Agent
{
    public class AgentClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _backendUrl;

        public AgentClient(string backendUrl)
        {
            _httpClient = new HttpClient();
            _backendUrl = backendUrl;
        }

        public async Task SendEventsAsync(List<EventDto> events)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_backendUrl}/api/events", events);
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Successfully sent {events.Count} events.");
                }
                else
                {
                    Console.WriteLine($"Error sending events: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception while sending events: {ex.Message}");
            }
        }

        public async Task SendHeartbeatAsync(HeartbeatDto heartbeat)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_backendUrl}/api/heartbeat", heartbeat);
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Successfully sent heartbeat.");
                }
                else
                {
                    Console.WriteLine($"Error sending heartbeat: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception while sending heartbeat: {ex.Message}");
            }
        }

        public EventDto FromSysmonProcessEvent(int pid, int ppid, string image, string commandLine, string user, string host, string deviceId)
        {
            return new EventDto
            {
                Type = "process_start",
                Timestamp = DateTime.UtcNow,
                Host = host,
                DeviceId = deviceId,
                User = user,
                Severity = "info",
                Source = "sysmon",
                Data = new Dictionary<string, object>
                {
                    { "pid", pid },
                    { "ppid", ppid },
                    { "image", image },
                    { "commandLine", commandLine }
                }
            };
        }

        public EventDto FromSysmonNetworkEvent(string protocol, string destinationIp, int destinationPort, string user, string host, string deviceId)
        {
            return new EventDto
            {
                Type = "network_connection",
                Timestamp = DateTime.UtcNow,
                Host = host,
                DeviceId = deviceId,
                User = user,
                Severity = "info",
                Source = "sysmon",
                Data = new Dictionary<string, object>
                {
                    { "protocol", protocol },
                    { "destinationIp", destinationIp },
                    { "destinationPort", destinationPort }
                }
            };
        }

        public EventDto FromSecurityLogLogonEvent(string logonType, string user, string host, string deviceId)
        {
            return new EventDto
            {
                Type = "logon",
                Timestamp = DateTime.UtcNow,
                Host = host,
                DeviceId = deviceId,
                User = user,
                Severity = "info",
                Source = "security_log",
                Data = new Dictionary<string, object>
                {
                    { "logonType", logonType }
                }
            };
        }
    }
}
