/*
 *	This file is part of BlockChain-101 package which is released under the MIT License.
 *	See file LICENSE file for full license details.
 */ 	

/*
 * Change Log (bump the version in scfg)
 *
 * 	0.0 - Very Simple HTTP Server
 *
 */
 
/* 
 * Server Configuration
 */
var scfg = {
    SID: "Theory00Server",
	PORT: '8093',
	STARTPAGE: 'C:\\BlockChain-101\\BlockChainTheory\\web\\Theory00_index.html',
	PAGESROOT: 'C:\\BlockChain-101\\BlockChainTheory\\',
	VERSION: '0.0',
	getServer: function() {
		return this.SID + ":" + this.PORT;
	}
}

//
// Requires 
// 

var fs = require('fs');
var url = require('url');
var http = require("http");
var express = require('express');

//
// Express Server 
// 
var app = express();

app.use(function(req, res, next) {
  console.log(scfg.getServer() + " Incoming " + req.method + " request for " + req.url);
  next();
});

//
// Those methods are used to act as root server 
//

// Respond to the index page
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(fs.readFileSync(scfg.STARTPAGE));	
    res.end();
})

// Respond to the _frame pages
app.get('/*_frame.html', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(fs.readFileSync(scfg.PAGESROOT + req.url));	
    res.end();
})
// Respond to css
app.get('/*.css', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/css'});
	res.write(fs.readFileSync(scfg.PAGESROOT + req.url));	
    res.end();
})
// Respond to Image
app.get('/*.jpg', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/xyz'});
	res.write(fs.readFileSync(scfg.PAGESROOT + req.url));	
    res.end();
})

app.get("*", function(req, res) {
  res.write(scfg.getServer() + " ERROR 404 - Do not know how to handle Incoming " + req.method + " request for " + req.url);
  console.log(scfg.getServer() + " ERROR 404 -Do not know how to handle Incoming " + req.method + " request for " + req.url);
  res.end();
});

//Create and start the server. The callback is called when 
var server = http.createServer(app);
server.listen(scfg.PORT, function(){
        console.log(scfg.getServer() + " Version: " + scfg.VERSION + " listening on: http://localhost:%s start page: %s", scfg.PORT, scfg.STARTPAGE);
});
