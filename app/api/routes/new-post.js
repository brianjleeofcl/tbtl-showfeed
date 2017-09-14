const express = require('express');
const router = express.Router();

const knex = require('../../knex');
const axios = require('axios');

const refreshToken = function(req, res) {
  knex('reddit_users').where('user_name', 'tbtl_showfeed').select('refresh_token').then(([result]) => {
    return axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=refresh_token&refresh_token=${result.refresh_token}`, 
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID, 
          password: process.env.REDDIT_CLIENT_SECRET
        }
      })
  }).then(({data, request}) => {
    console.log(require('util').inspect(data))
  }).catch(({response, request})=> {
    console.error(require('util').inspect(request))
    res.sendStatus(response.status)
  });
}

router.post('/', (req, res) => {
  const { title, url, description } = req.body;



});

router.post('/test', refreshToken, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;