//HTTP dependecy

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
//server shoudl all requests with a string  
//start server and listen port

var server = http.createServer(function(req, res){
    //get url and parsed and send the response
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var requestPath = path.replace(/^\/+|\/+$/g,'');
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
        var chooseHandler = typeof(router[requestPath]) !== 'undefined' ? router[requestPath] : handlers.notFound;

        var data = {
            'requestPath' : requestPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer,
        };        
        
        //choose request router handler on the specified router
        chooseHandler(data, function(statusCode, payload){
            //use status code
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            //convert payload to a string_decoder
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(buffer);
        });
    });
    
});

server.listen(config.port, function(){
    console.log(`The server is up and running on port  ${config.port} in ${config.envName} mode.`);
})

var handlers = {}

handlers.sample = function(data, callback){
//here callback response with http status code , payload
    callback(201, {'name': 'sample handler'});
};

handlers.notFound = function(data, callback){
    callback(404);
};
var router = {
    'sample': handlers.sample
};