const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const toDoRoutes = require('./routes/toDoRouter');
const itemRoutes = require('./routes/itemRouter')
const path = require('path'); // Node.js path module

const app = express();
const port = process.env.PORT || 9000;

// Morgan Middleware
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000' 
  }));
  

// CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply Routers
app.use('/api', toDoRoutes);
app.use('/api', itemRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all handler for React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});