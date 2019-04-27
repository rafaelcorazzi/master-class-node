//HTTP dependecy

var http = require('http');
var url = require('url');

//server shoudl all requests with a string  
//start server and listen port

var server = http.createServer(function(req, res){
    //get url and parsed and send the response
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimPath = path.replace(/^\/+|\/+$/g,'');

    res.end('Hello World');

    console.log(`Request received on this path: ${trimPath}`);
});

server.listen(3000, function(){
    console.log('Listening on port 3000');
})