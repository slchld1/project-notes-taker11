const express = require('express');

// Creating new Route
const notesRouter = require('./api');

const app = express();

// New Route created for notes
app.use('/notes', notesRouter);


module.exports = app;
