const express = require('express');
const router = express.Router();

const knex = require('../../knex');
const axios = require('axios');
const qs = require('querystring');

const refreshToken = function(req, res, next) {
  knex('reddit_users').where('user_name', 'tbtl_showfeed').select('refresh_token').then(([result]) => {
    axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=refresh_token&refresh_token=${result.refresh_token}`, 
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID, 
          password: process.env.REDDIT_CLIENT_SECRET
        }
      }
    ).then(({data}) => {
      console.log(require('util').inspect(data));
      knex('reddit_users').where('user_name', 'tbtl_showfeed').update('access_token', data.access_token);
      req.token = data.access_token;
      req.token_type = data.token_type
      next();
    }).catch(({response})=> {
      res.sendStatus(response.status);
    })
  }).catch(() => res.sendStatus(500));
}

router.post('/', refreshToken, (req, res) => {
  const { title, url, description, secret } = req.body;
  if (secret !== process.env.SECRET_HANDSHAKE) return res.sendStatus(403);
  const data = {
    sr: 'tbtl',
    title,
    text: `*${description}*\r\n\r\n**[Listen at apmpodcasts.org](${url})**`,
    kind: 'self',
    sendreplies: false,
    api_type: 'json'
  };

  console.log(qs.stringify(data));

  axios.post(
    'https://oauth.reddit.com/api/submit', 
    qs.stringify(data), 
    {
      headers: {
        'Authorization': `${req.token_type} ${req.token}`
      }
    } 
  ).then(({data}) => {
    if (data.json.errors.length > 0) res.sendStatus(500);
    else res.sendStatus(200);
  }).catch(error => {
    console.error(error);
    res.sendStatus(error.response.status);
  })
});

router.post('/test', refreshToken, (req, res) => {
  const data = {
    sr: 'test',
    title: 'Test Post',
    text: 'this is a test post!',
    kind: 'self',
    sendreplies: false,
    api_type: 'json'
  };

  axios.post(
    'https://oauth.reddit.com/api/submit', 
    qs.stringify(data), 
    {
      headers: {
        'Authorization': `${req.token_type} ${req.token}`
      }
    } 
  ).then(({data, request}) => {
    console.log(require('util').inspect(request));
    console.log(require('util').inspect(data));
    res.sendStatus(200);
  }).catch(error => {
    console.error(error);
    res.sendStatus(error.response.status);
  })
});

module.exports = router;