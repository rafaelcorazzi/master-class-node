//HTTP dependecy

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
//server shoudl all requests with a string  
//start server and listen port

var server = http.createServer(function(req, res){
    //get url and parsed and send the response
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimPath = path.replace(/^\/+|\/+$/g,'');
    var queryStringObject = parsedUrl.query;
    var method = req.method.toLowerCase();
    var headers = req.headers;
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();
        res.end('Hello World');
        console.log(buffer);
        
    });
    
});

server.listen(3000, function(){
    console.log('Listening on port 3000');
})