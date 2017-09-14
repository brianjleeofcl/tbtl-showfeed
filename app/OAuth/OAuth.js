const express = require('express');
const router = express.Router();

const knex = require('../knex');

router.get('/start', (req, res) => {
  // makes sure only requests with secret gets redirected; this prevents any random user from accessing the app.
  if (req.query.secret === process.env.SECRET_INIT) res.redirect(302, `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${process.env.REDDIT_STATE_STRING}&redirect_uri=https://tbtl-showfeed.herokuapp.com/OAuth/redirect&duration=permanent&scope=submit`);
  else res.sendStatus(403);
})

router.get('/redirect', (req, res) => {
  const { code, state } = req.query;
  if (state !== process.env.REDDIT_STATE_STRING) return res.sendStatus(403);
  else {
    res.redirect(302, 'https://www.reddit.com/r/tbtl');
    axios.post(
      'https://www.reddit.com/api/v1/access_token', 
      `grant_type=authorization_code&code=${code}&redirect_uri=https://tbtl-showfeed.herokuapp.com/OAuth/redirect`, 
      { auth: {
        username: process.env.REDDIT_CLIENT_ID, password: process.env.REDDIT_CLIENT_SECRET
      }
    }).then(({data}) => {
      
      console.log(require('util').inspect(data));
    });
  }
})

module.exports = router;