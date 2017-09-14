const path = require('path');
const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

app.disable('x-powered-by');

app.use(
  require('morgan')('dev'),
  require('body-parser').json()
)

app.use('/OAuth', require('./OAuth/OAuth'));
app.use('/api', require('./api/api'));

module.exports = app;
