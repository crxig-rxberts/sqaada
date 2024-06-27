const express = require('express');
const toDoRoutes = require('../../server/routes/toDoRouter');
const itemRoutes = require("../../server/routes/itemRouter");
const morgan = require("morgan");
const bodyParser = require("body-parser");

function createServer() {
    const app = express();

    app.use(morgan('combined'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/api', toDoRoutes);
    app.use('/api', itemRoutes);

    return app;
}

module.exports = createServer;