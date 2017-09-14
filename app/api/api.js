const express = require('express');
const router = express.Router();

const knex = require('../knex');

router.use('/new-post', require('./routes/new-post'));

module.exports = router;