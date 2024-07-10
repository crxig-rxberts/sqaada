const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const toDoRoutes = require('./routes/toDoRouter');
const itemRoutes = require('./routes/itemRouter')
const path = require('path');
const http = require("http");

const app = express();
const port = process.env.PORT || 8080;
const SERVER_IP = process.env.SERVER_IP || 'localhost'

// Middleware / Req/Res Intercept
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Apply CORS
app.use(cors({
    origin: [`http://${SERVER_IP}:3000`, `http://${SERVER_IP}:8080`, `http://${SERVER_IP}`],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply Routers
app.use('/api', toDoRoutes);
app.use('/api', itemRoutes);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all handler for React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server started at port ${SERVER_IP}:${port}`);
});

module.exports = server;
