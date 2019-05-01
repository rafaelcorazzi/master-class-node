//HTTP dependecy

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var https = require('https');
var fs = require('fs');
//server shoudl all requests with a string
//start server and listen port

var httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function(){
    console.log(`The server is up and running on port  ${config.httpPort} in ${config.envName} mode.`);
})

var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, function(){
    console.log(`The server is up and running on port  ${config.httpsPort} in ${config.envName} mode.`);
})
var unifiedServer = function(req, res){
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

        });
    });
}



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
