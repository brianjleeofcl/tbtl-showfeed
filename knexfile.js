'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/2048'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};