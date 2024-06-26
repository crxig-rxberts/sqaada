// index.js (Express server)
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const toDoRoutes = require('./routes/toDoRouter');
const itemRoutes = require('./routes/itemRouter')
const path = require('path'); // Node.js path module

const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Apply Routers
app.use('/api', toDoRoutes);
app.use('/api', itemRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all handler for React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
