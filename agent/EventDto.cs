using System;
using System.Collections.Generic;

namespace EDR_AGENT_BETA.Agent
{
    public class EventDto
    {
        public string Type { get; set; }           // process_start, network_connection, logon, etc.
        public DateTime Timestamp { get; set; }
        public string Host { get; set; }
        public string DeviceId { get; set; }
        public string User { get; set; }
        public string Severity { get; set; }       // info, warning, high
        public string Source { get; set; }         // sysmon, security_log, agent
        public Dictionary<string, object> Data { get; set; }
    }
}
