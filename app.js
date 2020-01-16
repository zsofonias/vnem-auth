const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const passport = require('passport');
const cors = require('cors');

const AppError = require('./utils/AppError');
const ErrorsController = require('./controllers/ErrorsController');

// init app
const app = express();

app.use(morgan('dev'));

app.use(cors());

// make app handle json data
app.use(express.json({ limit: '10kb' }));
// app.use(bodyparser.json())

// init and use passport middleware
// app.use(passport.initialize());
// require('./middlewares/passport')(passport);

// set static file/public directory
app.use(express.static(path.join(__dirname, 'public')));

// import routes
const auth_router = require('./routes/auth_router');
const users_router = require('./routes/users_router');

// init routes
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/users', users_router);

// handle unregistred routes
app.all('*', (req, res, next) => {
  next(new AppError(`Resource Not Found on ${req.url}`, 404));
});

// setup error catcher
app.use(ErrorsController.errorDispatcher);

module.exports = app;
