using System;

namespace EDR_AGENT_BETA.Agent
{
    public class HeartbeatDto
    {
        public string DeviceId { get; set; }
        public string Host { get; set; }
        public string AgentVersion { get; set; }
        public DateTime LastSeen { get; set; }
        public string Status { get; set; }         // healthy, degraded, offline
        public string Os { get; set; }
        public double CpuUsage { get; set; }       // optional
        public double RamUsage { get; set; }       // optional
    }
}
