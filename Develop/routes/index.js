const express = require('express');


const notesRouter = require('./api');

const app = express();

app.use('/notes', notesRouter);


module.exports = app;
