/********************************************************

	streamer.js
	
	Child process for starting and stopping the
	live preview stream
	
********************************************************/

var fs = require('fs'); 		// load fs module for access to the file system

// load jpegExtractor module to decode the mjpeg stream into individual jpegs
var jpegExtractor = require('jpeg-extractor');

// load exec from the child_process module to execute syscalls
const exec = require('child_process').exec;

var readable; 			// file read stream
var running = false;		// status bool

/*
	Event Handler : jpegExtrator recieves a new complete image
*/
var cnt = 0;
var je = jpegExtractor().on('image', function (image) {
	// send every third image to the parent process
	if (cnt++ % 3 == 0) process.send(image);
});

/*
	Event Handler : parent process sends a new message
*/
process.on('message', (m) => {
	console.log("streamer.js > ", m);
	switch (m) {
		// recieving start
		case 'start':
			/*
				if not already running
				* create a new read stream from precreated fifo file
				* pipe fifo file to jpegExtractor
				* start gphoto2 in video mode and redirect the outstream to fifo
				* toggle status
			*/
			if ( !running ) {
				readable = fs.createReadStream("fifo.mjpeg");
				readable.pipe(je);
				
				exec("gphoto2 --capture-movie --stdout  > fifo.mjpeg");
				running = true;
			}
			break;
		case 'stop':
			/*
				if still running
				* kill gphoto2  process
				* close the read stream
				* toggle status
			*/
			if ( running ) {
				exec("pkill gphoto2");
				readable.close();
				running = false;
			}
			break;
	}
});
