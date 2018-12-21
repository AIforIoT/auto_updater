const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index_v1');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res/*, next*/) {
  res.status(err.status || 500).send(err);
});

module.exports = app;
