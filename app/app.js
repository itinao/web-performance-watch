/**
 * API
 */
var mysql = require('mysql');
var express = require('express');
var app = express();

app.get('/getSiteAll', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var con = getConnection();
  var param = req.query;
  var query = con.query('\
select m_site.*, count(*) as cnt, date(min(har_data.created)) as start_date, date(max(har_data.created)) as end_date \
from m_site left join har_data on m_site.id = har_data.site_id group by m_site.id',
    function (err, results) {
      res.send(results);
      con.destroy();
    }
  );
});

app.get('/getSite', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from m_site where id = ?', [param.id], function (err, results) {
    res.send(results);
    con.destroy();
  });
});

app.get('/getHar', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from har_data where site_id = ? order by id desc limit 10', [param.site_id], function (err, results) {
    res.send(results);
    con.destroy();
  });
});

app.get('/getSiteDetailDay', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from har_data where site_id = ? and created like concat(date(now()), "%")', [param.site_id], function (err, results) {
    var retData = [];
    results.forEach(function(result) {
      var har = JSON.parse(result.har);
      var pages = har.log.pages[0];
      var entries = har.log.entries;
      var mimeTypes = {};
      var contentSize = 0;
      entries.forEach(function(entry) {
        var content = entry.response.content;
        contentSize = content.size;
        if (!(content.mimeType in mimeTypes)) {
          mimeTypes[content.mimeType] = 0;
        }
        mimeTypes[content.mimeType] = mimeTypes[content.mimeType] + 1;
      });
      retData.push({
        pageTimings: pages.pageTimings,
        mimeTypes: mimeTypes,
        contentSize: contentSize
      });
    });
    res.send(retData);
    con.destroy();
  });
});

app.get('/getHarp/*', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var con = getConnection();
  var param = req.params;
  var query = con.query('select har from har_data where id = ?', [param[0]], function (err, results) {
    var har = JSON.parse(results[0].har);
    res.jsonp(har);
    con.destroy();
  });
});

app.get('/getYslow', function(req, res) {
  var con = getConnection();
  var param = req.query;
  var query = con.query('select * from yslow_data where site_id = ? order by id desc limit 10', [param.site_id], function (err, results) {
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
