var express = require('express');
var mongo   = require('mongodb');
var db = new mongo.Db('web_performance', new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}), {safe:true});
var app = express();

app.get('/getSitePerformance', function (req, res) {
  db.open(function() {
    db.collection('sitePerformance', function(err, collection) {
      collection.find().toArray(function(err, items) {
        console.log("sitePerformance: find success");
        db.close();
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.send(JSON.stringify(items));
      });
    });
  });
});

app.listen(3000);
