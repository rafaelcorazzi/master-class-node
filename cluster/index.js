const cluster = require('cluster');
var http = require('http');
var StringDecoder = require('string_decoder').StringDecoder;
var url = require('url');
if(cluster.isMaster){
    cluster.fork();
    //cluster.fork();
    //cluster.fork();
    //cluster.fork();
    //cluster.fork();
    //cluster.fork();
}else{
    var httpServer = http.createServer(function(req, res){
        unifiedServer(req, res);
    });
    
    httpServer.listen(3000, function(){
        console.log(`The server is up and running on port 3000 mode.`);
    })
    function doWork(duration){
        const start = Date.now();
        while(Date.now() - start < duration) {}
    }
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
        doWork(6000);
        callback(201, {'name': 'sample handler'});
    };

    handlers.fast = function(data , callback){
        callback(200, {'name': 'Fast handler'});
    };
    handlers.notFound = function(data, callback){
        callback(404);
    };
    var router = {
        'sample': handlers.sample,
        'fast': handlers.fast
    };

}