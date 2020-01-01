var http = require('http');
var URL = require('url').URL;
var server;
exports.start = function(port){
        if (typeof String.prototype.startsWith != 'function') {
          // see below for better implementation!
          String.prototype.startsWith = function (str){
            return this.indexOf(str) === 0;
          };
        }
        port=port || process.env.PORT || '8000';
	server=http.createServer(function (request, res) {
		var loanAmount=0;
		var creditValue=0;
		//console.log('request_url'+request_url+' method='+request.method);
		if(request.url==='/healthcheck'){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end('{"status":"UP"}');
			return;
		}
		if(request.url.startsWith("/LoanService/V1")){
			var request_url='http://' + request.headers.host + '/'+request.url;
			// routing
				if(request.method === 'GET') {
				var current_url = new URL(request_url);
				var search_params = current_url.searchParams;
				// "loanAmount" parameter
				if(search_params.has('loanAmount'))
					loanAmount = search_params.get('loanAmount');
				// "creditValue" parameter
				if(search_params.has('creditValue'))
					creditValue = search_params.get('creditValue');
				// rest of the code
				}
			//caluclations
			console.log('loanAmount='+loanAmount+' & creditValue='+creditValue);
			if(loanAmount<(creditValue/2)) {
				//send response back
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end('{"status":true,"amount": '+loanAmount+',"reason":"loan within credit safe value"}\n');
			}else{
				//send response back
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end('{"status":false,"amount": 0,"reason":"loan exceed the credit safe value"}\n');
			}
		}

	}).listen(port, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:'+port);
	console.log('Sample URL: http://127.0.0.1:'+port+'/LoanService/V1?loanAmount=1000&creditValue=3000 or /healthcheck');
}
exports.stop = function(){
	console.log('Need a way to stop the Server running at http://127.0.0.1:PORT');
	server.close();
}
