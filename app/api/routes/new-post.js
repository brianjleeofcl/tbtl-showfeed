const express = require('express');
const router = express.Router();

const knex = require('../../knex');

router.post('/', (req, res) => {
  const { title, url, description } = req.body;
});

module.exports = router;