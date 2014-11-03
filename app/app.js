/**
 * API
 */
var mysql = require('mysql');
var express = require('express');
var app = express();

app.get('/getSiteAll', function(req, res) {
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from m_site', function (err, results) {
    res.send(results);
    con.destroy();
  });
});

app.get('/getSite', function(req, res) {
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from m_site where id = ?', [param.id], function (err, results) {
    res.send(results);
    con.destroy();
  });
});

app.get('/getHar', function(req, res) {
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from har_data where site_id = ?', [param.site_id], function (err, results) {
    res.send(results);
    con.destroy();
  });
});

app.get('/getYslow', function(req, res) {
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from yslow_data where site_id = ?', [param.site_id], function (err, results) {
    res.send(results);
    con.destroy();
  });
});

var getConnection = function() {
  return mysql.createConnection({
    host: 'localhost',
    database: 'webp',
    user: 'root',
    password: ''
  });
};

app.listen(3000);
