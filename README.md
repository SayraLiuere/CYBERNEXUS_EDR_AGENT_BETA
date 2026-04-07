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
