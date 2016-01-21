var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');

var app = express();
var db = new mongo.Db('myapp', new mongo.Server('localhost', 27017, { auto_reconnect: true }));
var people = db.collection("people");

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response) {
  people.find().toArray(function(err, docs) {
      if (err) throw err;
      response.render("index.jade", { people: docs });
  });
});

app.post('/', function(request, response) {
    people.insert({ name: request.body.name, job: request.body.job }, function(err, doc) {
        if(err) throw err;
        response.redirect("/");
    });
});

app.get('update/:id', function(request, response) {
    people.findOne({ _id: new mongo.ObjectID(request.params.id) }, function(err, doc) {
        if(err) throw err;
        response.render("update.jade", { person: doc});
    });
});


app.post("/update/:id", function(request, response) {
    people.update(
        { _id: new mongo.ObjectID(request.params.id) },
        {
          name: request.body.name,
          job: request.body.job
        }, function(err, item) {
          if(err) throw err;
          response.redirect("/");
    });
});

app.get('/delete/:id', function(request, response) {
    people.remove({ _id: new mongo.ObjectID(request.params.id) }, function(err) {
        if(err) throw err;
        response.redirect("/");
    });
});

app.listen(3000, function() {
    console.log("Listening on 3000");
});

module.exports = app;
