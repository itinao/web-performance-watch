var simplehar = require('simplehar');
var path = require('path');
var harFile = path.join('harFolder', 'myHarFile.har');
var htmlFile = path.join('webroot', 'myHtmlFile.html');
simplehar({
  har:harFile,
  html:htmlFile,
  lng:false,
});
/*
//<style>...</style>...html...<script>...</script>
var result = simplehar({
    har:harFile,
    html:htmlFile,
    lng:false,
    frame:true,
    return:true
});
*//*
//{
//    css:'...',
//    js:'...',
//    html:'...'
//}
var result = simplehar({
  har:harFile,
//  html:htmlFile,
  lng:false,
  frame:true,
  return:true,
  frameContent:{
    css:false,
    js:false
  }
});
console.log(result);
*/
