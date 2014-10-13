module.exports = function (grunt) {
 
//  grunt.registerTask('hello', 'description here', function() {
//    grunt.log.writeln('hello! hello!');
//  });
// 
//  grunt.registerTask('default', [ 'hello' ]);
// 
};

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    site: {
      performance:{
        options: {
          srcFiles: [
            {site: 'yahoo', url: 'http://yahoo.co.jp'},
            {site: 'google', url: 'http://google.com'}
          ]
        }
      }
    }
  });


  // $ ./node_modules/.bin/grunt site:performance

  require('date-utils');
  var child        = require('child_process');
  var exec         = child.exec;
  var YSLOW        = require('yslow').YSLOW;
  var doc          = require('jsdom').jsdom();
  var fs           = require('fs');
  var util         = grunt.utils || grunt.util;
  var _            = util._;
  var async        = util.async;
  var phantomjsCmd = __dirname + '/node_modules/.bin/phantomjs';
  var netsniffjs   = __dirname + '/node_modules/phantomjs/lib/phantom/examples/netsniff.js';
  var tmpHarFile   = '.har_tmp';

  var mongo        = require('mongodb');
  var db           = new mongo.Db('web_performance', new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}), {safe:true});

  var simplehar    = require('simplehar');

  grunt.registerMultiTask('site', 'Web Performance', function() {
    var options  = this.options();
    var done = this.async();
    var srcFiles = options.srcFiles;

    async.forEachSeries(srcFiles, function(src, next) {
      exec(phantomjsCmd + ' ' + netsniffjs + ' ' + src.url + ' > ' + tmpHarFile, function(error, stdout, stderr) {
        var har = JSON.parse(grunt.file.read(tmpHarFile));
        var dt = new Date();
        var formatted = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

        // yslowで解析する
        var res = YSLOW.harImporter.run(doc, har, 'yslow1');
        var content = YSLOW.util.getResults(res.context, 'grade,stats,comps');

        // harviewerからHTMLを取得
        var harViewerHtml = simplehar({
          har:    tmpHarFile,
          lng:    false,
          frame:  true,
          return: true,
          frameContent: {
            css: false,
            js:  false
          }
        });

        // DB保存.
        db.open(function() {
          db.collection('sitePerformance', function(err, collection) {
            collection.insert({site: src.site, url: src.url, created: formatted, har: har, yslow: content, html: harViewerHtml}, function() {
              console.log("sitePerformance: insert success");
              db.close();
              next();
            });
          });
        });

      });
    }, done);
  });
};


