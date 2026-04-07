# CyberNexus EDR Agent Beta

A telemetry-first Endpoint Detection and Response (EDR) prototype featuring a C# agent, a Node.js backend, and a React-based security dashboard.

## 🚀 Project Structure

- **`/agent`**: C# Agent source code. Handles telemetry collection (Sysmon-style) and heartbeats.
- **`/backend`**: Node.js/Express API. Receives telemetry and heartbeat data, storing it in-memory.
- **`/frontend`**: React + Vite + Tailwind CSS dashboard. Visualizes active endpoints and security events.

## 🛠️ Components

### 1. C# Agent
The agent simulates security events and sends them to the backend.
- **Event Schema**: Unified JSON structure for all event types (process, network, logon).
- **Heartbeat**: Periodic status updates (CPU/RAM usage, OS info).
- **Client**: `AgentClient` for asynchronous communication with the API.

### 2. Backend API
Lightweight server for data ingestion.
- `POST /api/events`: Batch telemetry storage.
- `POST /api/heartbeat`: Endpoint status tracking.
- `GET /api/events`: Query historical telemetry.
- `GET /api/endpoints`: List all monitored devices.

### 3. Security Dashboard
A modern UI for security analysts.
- **Dashboard**: High-level metrics (Active Endpoints, Event Volume).
- **Endpoints View**: Real-time health and resource monitoring.
- **Telemetry Log**: Detailed event stream with JSON payload inspection.

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [.NET SDK](https://dotnet.microsoft.com/download) (for the agent)

### Running the Backend
```bash
cd backend
npm install
node index.js
```
The backend will run on `http://localhost:3001`.

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

### Running the Agent
1. Open the `/agent` folder in your preferred C# IDE (e.g., VS Code or Visual Studio).
2. Ensure the backend is running.
3. Run the project:
```bash
dotnet run
```

## 🔒 Security Design
This prototype follows a **telemetry-first** approach, ensuring that all endpoint activity is normalized into a consistent schema, making it easy to build detection logic and visualize attack timelines.

## 📝 Progress Log

### **Commit 1: Initial Prototype (Telemetry-First Design)**
- **What Changed**: 
  - Implemented core C# Agent DTOs and `AgentClient`.
  - Created Node.js/Express backend with `/api/events`, `/api/heartbeat`, and `/api/endpoints` endpoints.
  - Built initial React dashboard with "Security Overview", "Managed Endpoints", and "Telemetry Logs" tabs.
- **How to Test**:
  - Run the backend (`node backend/index.js`) and frontend (`npm run dev`).
  - Send a manual heartbeat:
    ```powershell
    $heartbeat = '{"deviceId": "WIN10LAB-01", "host": "WIN10LAB-01", "agentVersion": "0.1.0", "lastSeen": "2026-04-07T12:39:00Z", "status": "healthy", "os": "Windows 10", "cpuUsage": 0.2, "ramUsage": 0.5}'; Invoke-RestMethod -Uri "http://localhost:3001/api/heartbeat" -Method Post -Body $heartbeat -ContentType "application/json"
    ```

### **Commit 2: Real-Time Alerts System**
- **What Changed**:
  - Added in-memory `alerts` store to the backend.
  - Implemented `evaluateRulesForEvent` helper with rules for Mimikatz detection (T1003) and Obfuscated PowerShell (T1059).
  - Integrated rule evaluation into the `POST /api/events` flow.
  - Added "Alerts" tab to the React frontend with a dedicated incidents table and dashboard counter.
  - **Enhanced Visibility**: Telemetry logs now show severity badges and a "TRIGGERED ALERT" label for suspicious events.
  - **Dashboard Widget**: Added a "Recent Alerts" section to the main dashboard for immediate awareness.
- **How to Test Alerts**:
  - Send a suspicious Mimikatz process event:
    ```powershell
    $body = '[{"type": "process_start", "timestamp": "2026-04-07T12:39:00Z", "host": "WIN10LAB-01", "deviceId": "WIN10LAB-01", "user": "WIN10LAB\\Student", "severity": "info", "source": "sysmon", "data": {"pid": 9999, "ppid": 123, "image": "C:\\temp\\mimikatz.exe", "commandLine": "mimikatz.exe sekurlsa::logonpasswords"}}]'
    Invoke-RestMethod -Uri "http://localhost:3001/api/events" -Method Post -Body $body -ContentType "application/json"
    ```
  - Verify:
    1. The "Threats Detected" counter increases.
    2. A new entry appears in the "Recent Alerts" dashboard widget.
    3. The event in "Telemetry Logs" is highlighted in red with a "High" severity badge.
    4. The full alert details appear in the "Alerts" tab.


