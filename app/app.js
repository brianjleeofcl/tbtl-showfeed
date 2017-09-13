const path = require('path');
const express = require('express');
const app = express()

app.disable('x-powered-by');

app.use(
  require('morgan')('dev'),
  require('body-parser').json()
)

// app.use('/api',require('./api/api'))

// app.use(express.static(path.resolve(__dirname, '..', 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
// });

module.exports = app;
