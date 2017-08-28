var http = require('http');
var fs = require('fs');

var exec = require('child_process').execSync;
var fork = require('child_process').fork;

require('./ext.js')();

var child = fork('streamer.js');

var buffer = "";

var server = http.createServer( function( request,  response ){
	
	// Analyse Request
	//console.log( ">" + request.url);
	
	// Base URL requested
	if ( request.url == "/" ) {
		
		// Commands via POST ?
		if( request.method == "POST") {
		
			console.log("-> POST /");
			
			var body = '';
			request.on('data', function(data) {
				body += data;
			});
			request.on('end', function() {
				console.log("--> POST /" + body);
				
				changeSettings(body, response);
				/*
				response.writeHead(200, {"Content-Type": "text/json"});
				response.end('{"status":"ok"}');*/
			});

		} else {
			// Display standard page
			var html = fs.readFileSync('main.html');
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(html);
		}
		
	} else if ( request.url.split("/")[1] == "pre" ) {
		
		console.log("-> /pre - transmitting new picture");
		
		sendPreview(response);

	} else if ( request.url.split("/")[1] == "start" ) {
		
		console.log("-> /start - starting stream");
		
		startStream(response);

	} else if ( request.url.split("/")[1] == "stop" ) {
		
		console.log("-> /stop - stopping stream");
		
		stopStream(response);

	} else if ( request.url.split("/")[1].split("?")[0] == "buffer" ) {
		
		//console.log("-> /test - testing buffer");
		
		response.writeHead(200, {"Content-Type": "image/jpeg"});
		response.end(buffer);

	} else if ( request.url.split("/")[1] == "settings" ) {
		
		console.log("-> /settings - collecting camera data...");
		
		checkSettings(response);

	} else  {
		
		var path = request.url.slice(1);
		path = path.split("?")[0];
		var ext = path.split(".");
		ext = ext[ext.length-1];
		
		console.log("-> " + path);
		
		if ( fs.existsSync(path) ) {
			
			// requested existing file
			var html = fs.readFileSync(path);
			// get mime type
			ext = getExtension(ext);
			
			console.log("<< 200 " + ext);
			response.writeHead(200, {"Content-Type": ext});
			response.end(html);
			
		} else {
			
			console.log("<< 404 not found");
			// no known route and no existing file		
			response.writeHead(404, {"Content-Type": "text/html"});
			response.end();
			
		}
	}
});

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");

function changeSettings( body, response ) {
	
	child.send("stop");
	setTimeout( function() {
		var para = body.split("&")[0].split("=")[0];
	
		if ( para == "capture" ) {
			var val = body.split("&")[0].split("=")[1];
			takePicture(val, response);
		} else {
			para = body.split("&")[0].split("=")[1];
			var val = body.split("&")[1].split("=")[1];
		
			console.log(">> change Settings: " + para + "=" + val);
	
			var ret = '';
			try {
				ret = exec('gphoto2 --set-config ' + para + '=' + val);
				ret = (ret == "" ? "ok" : ret);
				console.log("<< " + ret);
			} catch (err) {
				console.log("-!- Error: ", err);
				ret = "error";
			}
	
	
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"' + ret + '"}');
		
			child.send("start");
		}
	}, 1000 );
}

function checkSettings(response) {

	// f-number || aperture
	var settings = ["iso","aperture","shutterspeed"];
	var returns = new Array(3);
	
	var camSettings = {};
	
	// check for Canon or Nikon camera
	try {
		exec('gphoto2 --get-config aperture');
	} catch (err) {
		settings[1] = "f-number";
	}
	
	
	for ( var i = 0; i < settings.length; i++) {
		try {
			
			camSettings[settings[i]] = {};
			
			returns[i] = exec('gphoto2 --get-config ' + settings[i]);
			
			/* Convert Output */
			returns[i] = returns[i].toString();
			var lines = returns[i].split('\n');
			
			camSettings[settings[i]].type = lines[0].slice(7);
			camSettings[settings[i]].current = lines[2].slice(9);
			camSettings[settings[i]].options = {};
			
			for (var j = 3; j < lines.length-1; j++) {
				var values = lines[j].split(" ");
				camSettings[settings[i]].options[values[1]] = values[2];
				
				if ( values[2] == camSettings[settings[i]].current )
					camSettings[settings[i]].currentID = values[1]; 
			}
			
		} catch (err) {
			console.log("-!- Error: ", err);
			returns[i] = "error";
		}
	}
	
	console.log("done");
	
	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok","settings":' + JSON.stringify(camSettings) + '}');
}

function sendPreview( response ) {
	console.log("<< new preview" );
	exec('echo "y" | gphoto2 --capture-preview');
	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok","image":"capture_preview.jpg"}');
}

function takePicture(time, response ) {
	time = parseInt(time);
	console.log("<< new picture in " + time + "s" );
	
	setTimeout(function () {
		child.send('stop');
	}, (time > 1 ? time - 1 : 0 ) * 1000 );
	
	setTimeout(function() {
		
		try {
			ret = exec('echo "y" | gphoto2 --capture-image-and-download --filename=capture.jpg');
			console.log("<< " + ret.toString());
			
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"ok"}');
			
		} catch (err) {
			console.log("-!- Error: ", err);
			ret = "error";
		}
	}, time * 1000);
}

function startStream (response) {

	child.send('start'); 

	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok"}');
}

function stopStream (response) {

	child.send('stop');
	
	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok"}');
}

child.on('message', (m) => {
	buffer = new Buffer(m);
});

