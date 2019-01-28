/*
* Node homework assignment 1
*
*/

//Dependencies and global vars
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder
var port = 3000 //choice of port


//start server, and responds to all requests with the following function
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

httpServer.listen(port, function(){
    console.log("node server listening on port "+port);
});


var unifiedServer = function(req,res){
    var parsedUrl =  url.parse(req.url, true);
    //get path
    var path=parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    //get the query string as an object
    var queryStringObject = parsedUrl.query;
    //get HTTP method
    var method = req.method.toLowerCase();
    //Get the headers as an object
    var headers = req.headers;
    //parse the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();

        //choose the handler the request should go
        var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        chooseHandler(data,function(statusCode,payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('returning this response: ', statusCode, payloadString);
        });

    });
}

//handlers
var handlers = {};

handlers.hello = function(data,callback){
    callback(200,{'message':'welcome to homework assignment #1'});
};

//Not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

//Define a request router
var router = {
    'hello' : handlers.hello
};
