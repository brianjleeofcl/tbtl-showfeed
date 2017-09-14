const express = require('express');
const router = express.Router();

const knex = require('../../knex');
const axios = require('axios');

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

router.post('/', (req, res) => {
  const { title, url, description } = req.body;



});

router.post('/test', refreshToken, (req, res) => {
  axios.post(
    'https://oauth.reddit.com/api/submit', 
    {
      sr: 'test',
      title: 'Test Post',
      text: 'this is a test post!',
      kind: 'self',
      sendreplies: false,
      api_type: 'json'
    }, 
    {
      headers: {
        'Authorization': `${req.token_type} ${req.token}`
      }
    } 
  ).then(({data}) => {
    console.log(require('util').inspect(data));
    res.sendStatus(200);
  }).catch(error => {
    console.error(error);
    res.sendStatus(error.response.status);
  })
});

module.exports = router;