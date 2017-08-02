var express = require('express');
var path = require('path');
var compression = require('compression');
var proxy = require('http-proxy-middleware');


var app = express();

//add compression
app.use(compression());

//set up our proxy to the server
app.use('/doecode/api', proxy({target: process.argv[2], changeOrigin: true, pathRewrite: { '^/doecode/api' : ''}}));

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'dist')));

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

var PORT = process.argv[3];
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT);
})
