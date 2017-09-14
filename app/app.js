const path = require('path');
const express = require('express');
const app = express()
const axios = require('axios');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

app.disable('x-powered-by');

app.use(
  require('morgan')('dev'),
  require('body-parser').json()
)

app.get('/start', (req, res) => {
  // makes sure only requests with secret gets redirected; this prevents any random user from accessing the app.
  if (req.query.secret === process.env.SECRET_INIT) res.redirect(302, `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${process.env.REDDIT_STATE_STRING}&redirect_uri=https://tbtl-showfeed.herokuapp.com/redirect&duration=permanent&scope=submit`);
  else res.sendStatus(403);
})

app.get('/redirect', (req, res) => {
  const { code, state } = req.query;
  if (state !== process.env.REDDIT_STATE_STRING) return res.sendStatus(403);
  else {
    res.redirect(302, 'https://www.reddit.com/r/tbtl');
    axios.post(
      'https://www.reddit.com/api/v1/access_token', 
      `grant_type=authorization_code&code=${code}&redirect_uri=https://tbtl-showfeed.herokuapp.com/redirect`, 
      { auth: {
        username: process.env.REDDIT_CLIENT_ID, password: process.env.REDDIT_CLIENT_SECRET
      }
    }).then(({data}) => {
      console.log(require('util').inspect(data));
    });
  }
})

// app.use('/api', require('./api/api'));

// app.use(express.static(path.resolve(__dirname, '..', 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
// });

module.exports = app;
