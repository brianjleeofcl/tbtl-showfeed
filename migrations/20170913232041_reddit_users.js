
exports.up = function(knex) {
  return knex.schema.createTable('reddit_users', table => {
    table.increments();
    table.string('user_name').notNullable();
    table.string('access_token');
    table.string('refresh_token');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('reddit_users')
};
