import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Activity, List, Server, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [events, setEvents] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchEndpoints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/endpoints`);
      setEndpoints(response.data);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchEndpoints();
    fetchAlerts();
    const interval = setInterval(() => {
      fetchEvents();
      fetchEndpoints();
      fetchAlerts();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-800 h-screen fixed p-6 flex flex-col gap-8">
          <div className="flex items-center gap-3 text-blue-400">
            <Shield size={32} />
            <h1 className="text-xl font-bold">CyberNexus EDR</h1>
          </div>
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Activity size={20} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('endpoints')}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'endpoints' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Server size={20} /> Endpoints
            </button>
            <button 
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'alerts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <AlertCircle size={20} /> Alerts
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <List size={20} /> Telemetry
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8 w-full">
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold">Security Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-400 text-sm uppercase">Active Endpoints</h3>
                  <p className="text-3xl font-bold">{endpoints.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-400 text-sm uppercase">Total Events</h3>
                  <p className="text-3xl font-bold">{events.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-400 text-sm uppercase">Threats Detected</h3>
                  <p className="text-3xl font-bold text-red-500">{alerts.length}</p>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
                <div className="flex flex-col gap-3">
                  {alerts.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No alerts detected yet.</p>
                  ) : (
                    alerts.slice(-3).reverse().map((alert, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-750 p-3 rounded-lg border-l-4 border-red-500">
                        <AlertCircle className="text-red-500" size={20} />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold">{alert.title}</h4>
                          <p className="text-xs text-gray-400">{alert.host} • {new Date(alert.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <span className="text-[10px] bg-red-900 text-red-300 px-2 py-0.5 rounded uppercase font-bold">{alert.severity}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Host</th>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(-5).reverse().map((event, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-750">
                          <td className="py-3 px-4 font-mono text-sm">{event.type}</td>
                          <td className="py-3 px-4 text-sm">{new Date(event.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm">{event.host}</td>
                          <td className="py-3 px-4 text-sm">{event.user}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.severity === 'high' ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'}`}>
                              {event.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold">Managed Endpoints</h2>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {endpoints.map((endpoint, idx) => (
                    <div key={idx} className="bg-gray-750 p-6 rounded-lg border border-gray-700 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${endpoint.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <h3 className="font-bold">{endpoint.host}</h3>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{endpoint.agentVersion}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>Device ID: {endpoint.deviceId}</p>
                        <p>OS: {endpoint.os}</p>
                        <p>Last Seen: {new Date(endpoint.lastSeen).toLocaleTimeString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs">
                          <span>CPU</span>
                          <span>{(endpoint.cpuUsage * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: `${endpoint.cpuUsage * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-2">
                          <span>RAM</span>
                          <span>{(endpoint.ramUsage * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: `${endpoint.ramUsage * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold">Security Alerts</h2>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Host</th>
                        <th className="py-3 px-4">MITRE</th>
                        <th className="py-3 px-4">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.slice().reverse().map((alert, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-750">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${alert.severity === 'high' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                              {alert.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold">{alert.title}</div>
                            <div className="text-xs text-gray-400">{alert.description}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">{alert.host}</td>
                          <td className="py-3 px-4 text-sm font-mono text-blue-400">{alert.mitreTechniqueId}</td>
                          <td className="py-3 px-4 text-sm">{new Date(alert.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold">Telemetry Logs</h2>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Host</th>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice().reverse().map((event, idx) => (
                        <tr key={idx} className={`border-b border-gray-700 hover:bg-gray-750 ${event.isAlert ? 'bg-red-900/10' : ''}`}>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              event.isAlert || event.severity === 'high' ? 'bg-red-900 text-red-300' : 
                              event.severity === 'warning' || event.alertSeverity === 'medium' ? 'bg-yellow-900 text-yellow-300' : 
                              'bg-blue-900 text-blue-300'
                            }`}>
                              {event.alertSeverity || event.severity || 'info'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">
                            <div className="flex flex-col">
                              <span className="text-blue-300">{event.type}</span>
                              {event.isAlert && <span className="text-[10px] text-red-400 font-bold uppercase">ALERT TRIGGERED</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{new Date(event.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm">{event.host}</td>
                          <td className="py-3 px-4 text-sm">{event.user}</td>
                          <td className="py-3 px-4">
                            <pre className="text-xs bg-gray-900 p-2 rounded max-w-xs overflow-hidden text-ellipsis">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
