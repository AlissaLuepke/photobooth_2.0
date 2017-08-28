/********************************************************

	main.js
	
	Main file for photobooth project
	* requires linux, gphoto2, compatible USB camera
	
	* Starts an http server and handles basic routing to  local files.
	* Spawns forked processes for live stream handling
	* Interfaces with a USB camera via gphoto2 and GET/POST requests
	* Saves users photos on disk
	
	Functions:
	* changeSettings	( body, response ) 
	* checkSettings	( response )  
	* sendPreview	( response ) 
	* takePicture		( time, response )
	* startStream	( response )	
	* stopStream	( response )
	
********************************************************/
var http = require('http');		// load http module for basic web services
var fs = require('fs');			// load fs module for file system access

// load execSync from child_process module for synchronous syscalls
var exec = require('child_process').execSync;	
// load fork from child_process module for spawning communicating child processes
var fork = require('child_process').fork;

require('./ext.js')();				// load local ext module for file extension handling

var child = fork('streamer.js');	// create a new node instance from streamer.js

var buffer = "";				// buffer for live feed data


/***
	Basic web server
	* provides basic routing
	* provides requested files
	* handles actions and base logic
***/
var server = http.createServer( function( request,  response ){
	
	// Analyse Request
	
	// Base URL requested
	if ( request.url == "/" ) {
		
		// Commands via POST ?
		if( request.method == "POST") {
		
			console.log("-> POST /");
			
			/*
				assemble POST data chunks
				and delegate to changeSettings function
			*/
			var body = '';
			request.on('data', function(data) {
				body += data;
			});
			request.on('end', function() {
				//console.log("--> POST /" + body);
				
				changeSettings(body, response);
				
			});

		} else {
			// Display standard page
			var html = fs.readFileSync('landingpage.html');
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(html);
		}
	
	/***
		handle further routing
		* scan for predetermined function keywords
		* if none are found try to serve a local file
	***/	
	} else if ( request.url.split("/")[1] == "pre" ) {
		// fetch a new preview picture [deprecated]
		console.log("-> /pre - transmitting new picture");
		
		sendPreview(response);

	} else if ( request.url.split("/")[1] == "dir" ) {
		/***
			dir - serve a list of all gallery images as JSON Array
		***/
		console.log("-> /dir - sending gallery names");
		
		var retString = '[';
		var first = true;
		
		var files = fs.readdirSync("./photos");
		files.forEach(file => {
			if ( first ) {
				retString += '"' + file + '"';
				first = false;
			} else retString += ',"' + file + '"';
		});
		
		retString += ']';
		
		response.writeHead(200, {"Content-Type": "text/json"});
		response.end(retString);

	} else if ( request.url.split("/")[1] == "start" ) {
		// start the preview stream
		console.log("-> /start - starting stream");
		
		startStream(response);

	} else if ( request.url.split("/")[1] == "stop" ) {
		// stop the preview stream
		console.log("-> /stop - stopping stream");
		
		stopStream(response);

	} else if ( request.url.split("/")[1].split("?")[0] == "buffer" ) {
		/***
			check for /buffer?<random String> as not to get a cached image
			serve the current buffer content as jpeg image
		***/
		
		response.writeHead(200, {"Content-Type": "image/jpeg"});
		response.end(buffer);

	} else if ( request.url.split("/")[1] == "settings" ) {
		// check for and serve possible camera settings
		console.log("-> /settings - collecting camera data...");
		
		checkSettings(response);

	} else  {
		// fitting no other case, try to serve a local file
		var path = request.url.slice(1);
		path = path.split("?")[0];
		var ext = path.split(".");
		ext = ext[ext.length-1];
		
		console.log("-> " + path);
		
		// does this file exist?
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

// Start the server
server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
/***
		void changeSettings ( body, response )
		* accepts 	String		: body
					response	: response
		* handles the following actions:
			* capture a new photo
			* save a photo to disk
			* change camera settings	
***/
function changeSettings( body, response ) {
	
	// stop live feed
	child.send("stop");
	
	// wait a second to make sure camera is ready
	setTimeout( function() {
	
		// extract requested parameter
		var para = body.split("&")[0].split("=")[0];
	
		if ( para == "capture" ) {
			// take a new picture
			var val = body.split("&")[0].split("=")[1];
			takePicture(val, response);
			
		} else if ( para == "save" ) {
			/* 
				save current picture to disk
				* get current date as String
				* save as txt with prefixed timestamp
			*/
			var val = body.split("&")[0].split("=")[1];
			var text = body.split("&")[1].split("=")[1];
			var font = body.split("&")[2].split("=")[1];
			
			var output = '{"img":"' + val + '","text":"' + text + '","font":"' + font + '"}';
			
			var date = new Date();
			var sec = date.getSeconds();
			sec = sec > 9 ? sec : "0" + sec;
			var min = date.getMinutes();
			min = min > 9 ? min : "0" + min;
			var h = date.getHours();
			h = h > 9 ? h : "0" + h;
			var day = date.getDate();
			day = day > 9 ? day : "0" + day;
			var month = date.getMonth();
			month = month > 9 ? month : "0" + month;
			
			
			var file = date.getFullYear() + "_" + month + "_" + day + "_" + h + "_" + min + "_" + sec;
			
			fs.writeFile("photos/" + file + ".json", output, function(err) {
			    if(err) {
				console.log(err);
				response.writeHead(200, {"Content-Type": "text/json"});
				response.end('{"status":"error","error":"' + err + '"}');
			    }
			    console.log("<< new pic saved");
			}); 
			
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"ok"}');
			
		} else {
			/* 
				change a camera setting
				* filter which parameter
				* filter requested value
				* syscall gphoto2 to set new value
			*/
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
	
			// send response data to confirm execution
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"' + ret + '"}');
		
			// restart live feed
			child.send("start");
		}
	}, 1000 );
}

/***
		void checkSettings ( response )
		* accepts 	response	: response

		* checks for supported camera model
		* syscall gphoto2 to get iso, aperture and shutterspeed values
		* concat values to JSON object and send as reponse
***/
function checkSettings(response) {

	// f-number || aperture
	var settings = ["iso","aperture","shutterspeed"];
	var returns = new Array(3);
	
	var camSettings = {};
	
	// check for Canon or Nikon camera
	try {
		// Canon camera?
		exec('gphoto2 --get-config aperture');
	} catch (err) {
		settings[1] = "f-number";
		try {
			// Nikon camera?
			exec('gphoto2 --get-config f-number');
		} catch (err) {
			// No supported camera found
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"error","error":"no supported camera found!"}');
			return;
		}
	}
	
	// get the config values for each parameter
	for ( var i = 0; i < settings.length; i++) {
		try {
			
			camSettings[settings[i]] = {};
			
			returns[i] = exec('gphoto2 --get-config ' + settings[i]);
			
			/* Convert Output */
			returns[i] = returns[i].toString();
			var lines = returns[i].split('\n');
			
			// get type and current setting from the first 3 lines
			camSettings[settings[i]].type = lines[0].slice(7);
			camSettings[settings[i]].current = lines[2].slice(9);
			camSettings[settings[i]].options = {};
			
			// iterate over the remaining lines and seperate values and descriptions
			for (var j = 3; j < lines.length-1; j++) {
				var values = lines[j].split(" ");
				camSettings[settings[i]].options[values[1]] = values[2];
				
				// if this setting is the current one, remember the ID
				if ( values[2] == camSettings[settings[i]].current )
					camSettings[settings[i]].currentID = values[1]; 
			}
			
		} catch (err) {
			console.log("-!- Error: ", err);
			returns[i] = "error";
		}
	}
	
	console.log("done");
	
	// send the stringified camSettings Object as JSON to the client
	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok","settings":' + JSON.stringify(camSettings) + '}');
}

/***
		void sendPreview ( response )
		* accepts 	response	: response

		* syscall to gphoto2 to take a new preview
		* send link to file as response
		
		[DEPRECATED]
***/
function sendPreview( response ) {
	console.log("<< new preview" );
	// auto-overwrite the preview file (piping "y" to yes/no-prompt)
	exec('echo "y" | gphoto2 --capture-preview');
	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok","image":"capture_preview.jpg"}');
}

/***
		void takePicture ( time, response )
		* accepts 	int			: time to wait
					response	: response

		* stop live feed
		* wait <time> seconds
		* syscall gphoto2 to take a new picture
		* send confirmation
***/
function takePicture(time, response ) {
	time = parseInt(time);
	console.log("<< new picture in " + time + "s" );
	
	setTimeout(function () {
		child.send('stop');
	}, (time > 1 ? time - 1 : 0 ) * 1000 );
	
	setTimeout(function() {
		
		try {
			exec('echo "y" | gphoto2 --capture-image-and-download --filename=capture.jpg');
			
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"ok"}');
			
		} catch (err) {
			console.log("-!- Error: ", err);
			
			response.writeHead(200, {"Content-Type": "text/json"});
			response.end('{"status":"error"}');
		}
	}, time * 1000);
}

/***
		void startStream ( response )
		* accepts 	response	: response

		* send signal to child process to start live feed
***/
function startStream (response) {

	child.send('start'); 

	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok"}');
}

/***
		void stopStream ( response )
		* accepts 	response	: response

		* send signal to child process to stop live feed
***/
function stopStream (response) {

	child.send('stop');
	
	response.writeHead(200, {"Content-Type": "text/json"});
	response.end('{"status":"ok"}');
}

/***
		Event Handler : recieve new message from child process
		
		* save incoming data to buffer
***/
child.on('message', (m) => {
	buffer = new Buffer(m);
});

