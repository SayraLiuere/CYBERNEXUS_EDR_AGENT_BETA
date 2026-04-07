const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for events and heartbeats
let events = [];
let endpoints = {};

// POST /api/events
app.post('/api/events', (req, res) => {
    const newEvents = req.body;
    if (Array.isArray(newEvents)) {
        newEvents.forEach(event => {
            event.id = events.length + 1;
            events.push(event);
        });
        console.log(`Received ${newEvents.length} events.`);
        res.status(201).json({ message: 'Events stored successfully', count: newEvents.length });
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

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
