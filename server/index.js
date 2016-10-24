var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var db = require('../knexfile.js');

module.exports = app;

var rootPath = path.normalize(__dirname + '/../client');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use(express.static(path.join(__dirname + '/node_modules')));
app.use(express.static(path.join(rootPath, 'client')));

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './github-fetcher.sqlite3'
  }
});

app.post('/repos/import', function (req, res) {
  var repos = req.body.repos;
  Promise.all(repos.map(function(item) {
    if(knex('repos').whereNot({ name: item.name })) {
      return knex('repos')
        .insert({ name: item.name, owner: item.owner.login, stargazers_count: item.stargazers_count, url: item.svn_url })
        .then(function() {
          console.log("We did it!");
        });
    }
  }));
});

app.get('/repos', function (req, res) {
  knex.select().table('repos').limit(100)
    .then(function(collection) {
      res.json(collection);
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(rootPath, 'index.html'));
});

var port = process.env.PORT || 4040;
app.listen(port);
console.log("Listening on port " + port);
