using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EDR_AGENT_BETA.Agent
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Starting EDR Agent...");

            var backendUrl = "http://localhost:3001";
            var client = new AgentClient(backendUrl);

            var deviceId = "WIN10LAB-01";
            var host = "WIN10LAB-01";
            var user = "WIN10LAB\\Student";

            // Main loop for telemetry and heartbeat
            while (true)
            {
                // Send heartbeat every 30 seconds
                var heartbeat = new HeartbeatDto
                {
                    DeviceId = deviceId,
                    Host = host,
                    AgentVersion = "0.1.0",
                    LastSeen = DateTime.UtcNow,
                    Status = "healthy",
                    Os = "Windows 10",
                    CpuUsage = 0.2,
                    RamUsage = 0.5
                };
                await client.SendHeartbeatAsync(heartbeat);

                // Simulate some telemetry events
                var events = new List<EventDto>
                {
                    client.FromSysmonProcessEvent(1234, 456, @"C:\Windows\System32\cmd.exe", "cmd.exe /c whoami", user, host, deviceId),
                    client.FromSysmonNetworkEvent("TCP", "192.168.1.10", 443, user, host, deviceId),
                    client.FromSecurityLogLogonEvent("Interactive", user, host, deviceId)
                };
                await client.SendEventsAsync(events);

                Console.WriteLine("Waiting 30 seconds for next cycle...");
                await Task.Delay(TimeSpan.FromSeconds(30));
            }
        }
    }
}
