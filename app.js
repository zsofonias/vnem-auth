const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const cors = require('cors');

const AppError = require('./utils/AppError');
const ErrorsController = require('./controllers/ErrorsController');

// init app
const app = express();

app.use(morgan('dev'));

// make app handle json data
app.use(express.json({ limit: '10kb' }));
// app.use(bodyparser.json())

// set static file/public directory
app.use(express.static(path.join(__dirname, 'public')));

// import routes

// init routes

// handle unregistred routes
app.all('*', (req, res, next) => {
  next(new AppError(`Resource Not Found on ${req.url}`, 404));
});

// setup error catcher
app.use(ErrorsController.errorDispatcher);

module.exports = app;
