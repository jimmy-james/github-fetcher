// Each migration is expecting two functions on its API, up and down.  
// up is called when the migration is applied, and down is called on a migration rollback.
// In those functions you can use any of Knex' Schema Functions.
exports.up = function(knex, Promise) {
  return knex.schema.createTable('repos', function (table) {

    table.string('name');
    table.string('owner');
    table.primary(['name', 'owner']);
    table.integer('stargazers_count');
    table.string('url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('repos');
};


// To apply your new migration, in the terminal, run: knex migrate:latest  
// To make a change to your tables, create another migration. knex migrate:make step1  
// To remove the changes we've made so far, in the terminal run:knex migrate:rollback  
