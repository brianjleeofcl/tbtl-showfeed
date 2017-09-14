
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('reddit_users').del().then(() => {
      // Inserts seed entries
      return knex('reddit_users').insert([
        {
          id: 1, 
          'user_name': 'tbtl_showfeed',
          'access_token': '',
          'refresh_token': ''
        }
      ]);
    }).then(() => {
      return knex.raw(
        "SELECT setval('reddit_users_id_seq', (SELECT MAX(id) FROM reddit_users));"
      )
    });
};
