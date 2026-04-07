const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for events, endpoints and alerts
let events = [];
let endpoints = {};
let alerts = [];

function evaluateRulesForEvent(event) {
    const generatedAlerts = [];

    // Example Rule 1: suspicious credential dumping tool
    if (
        event.type === 'process_start' &&
        event.data &&
        typeof event.data.image === 'string' &&
        event.data.image.toLowerCase().includes('mimikatz')
    ) {
        generatedAlerts.push({
            id: alerts.length + 1,
            deviceId: event.deviceId,
            host: event.host,
            eventType: event.type,
            severity: 'high',
            title: 'Suspicious credential dumping tool execution',
            description: `Process ${event.data.image} launched by ${event.user || 'unknown user'}`,
            mitreTechniqueId: 'T1003',
            createdAt: new Date().toISOString(),
            status: 'open',
            eventSnapshot: event
        });
    }

    // Example Rule 2: obfuscated PowerShell
    if (
        event.type === 'process_start' &&
        event.data &&
        typeof event.data.commandLine === 'string' &&
        event.data.commandLine.toLowerCase().includes('powershell') &&
        event.data.commandLine.toLowerCase().includes('-enc')
    ) {
        generatedAlerts.push({
            id: alerts.length + generatedAlerts.length + 1,
            deviceId: event.deviceId,
            host: event.host,
            eventType: event.type,
            severity: 'medium',
            title: 'Potential obfuscated PowerShell command',
            description: `Command line: ${event.data.commandLine}`,
            mitreTechniqueId: 'T1059',
            createdAt: new Date().toISOString(),
            status: 'open',
            eventSnapshot: event
        });
    }

    return generatedAlerts;
}

// POST /api/events
app.post('/api/events', (req, res) => {
    const newEvents = req.body;
    if (Array.isArray(newEvents)) {
        let totalAlerts = 0;

        newEvents.forEach(event => {
            event.id = events.length + 1;
            events.push(event);

            const newAlerts = evaluateRulesForEvent(event);
            newAlerts.forEach(a => alerts.push(a));
            totalAlerts += newAlerts.length;
        });

        console.log(`Received ${newEvents.length} events. Generated ${totalAlerts} alerts.`);
        res.status(201).json({
            message: 'Events stored successfully',
            count: newEvents.length,
            alertsGenerated: totalAlerts
        });
    } else {
        res.status(400).json({ error: 'Body must be an array of events' });
    }
});

// POST /api/heartbeat
app.post('/api/heartbeat', (req, res) => {
    const heartbeat = req.body;
    if (heartbeat.deviceId) {
        endpoints[heartbeat.deviceId] = {
            ...heartbeat,
            lastSeen: new Date().toISOString()
        };
        console.log(`Received heartbeat from ${heartbeat.deviceId}.`);
        res.status(200).json({ message: 'Heartbeat received' });
    } else {
        res.status(400).json({ error: 'deviceId is required' });
    }
});

// GET /api/events
app.get('/api/events', (req, res) => {
    const { type, deviceId } = req.query;
    let filteredEvents = events;
    if (type) filteredEvents = filteredEvents.filter(e => e.type === type);
    if (deviceId) filteredEvents = filteredEvents.filter(e => e.deviceId === deviceId);
    res.json(filteredEvents);
});

// GET /api/endpoints
app.get('/api/endpoints', (req, res) => {
    res.json(Object.values(endpoints));
});

// GET /api/alerts
app.get('/api/alerts', (req, res) => {
    const { deviceId, severity, status } = req.query;
    let filtered = alerts;

    if (deviceId) filtered = filtered.filter(a => a.deviceId === deviceId);
    if (severity) filtered = filtered.filter(a => a.severity === severity);
    if (status) filtered = filtered.filter(a => a.status === status);

    res.json(filtered);
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
