var fs = require('fs');

var jpegExtractor = require('jpeg-extractor');

const exec = require('child_process').exec;

var readable; 
var running = false;

var cnt = 0;
var je = jpegExtractor().on('image', function (image) {
	if (cnt++ % 3 == 0) process.send(image);
});

process.on('message', (m) => {
	console.log("streamer.js > ", m);
	switch (m) {
		case 'start':
			if ( !running ) {
				readable = fs.createReadStream("fifo.mjpeg");
				readable.pipe(je);
				
				exec("gphoto2 --capture-movie --stdout  > fifo.mjpeg");
				running = true;
			}
			break;
		case 'stop':
			if ( running ) {
				exec("pkill gphoto2");
				readable.close();
				running = false;
			}
			break;
	}
});
