module.exports = function() {
	this.getExtension = function(ext) {
		switch (ext) {
				case "mjpeg":
					ext = "video/x-motion-jpeg";
					break;
				case "dwg":
					ext = "application/acad";
					break;
				case "asd":
				case "asn":
					ext = "application/astound";
					break;
				case "tsp":
					ext = "application/dsptype";
					break;
				case "dxf":
					ext = "application/dxf";
					break;
				case "spl":
					ext = "application/futuresplash";
					break;
				case "gz":
					ext = "application/gzip";
					break;
				case "js":
					ext = "application/javascript";
					break;
				case "json":
					ext = "application/json";
					break;
				case "ptlk":
					ext = "application/listenup";
					break;
				case "hqx":
					ext = "application/mac-binhex40";
					break;
				case "mbd":
					ext = "application/mbedlet";
					break;
				case "mif":
					ext = "application/mif";
					break;
				case "xls":
				case "xla":
					ext = "application/msexcel";
					break;
				case "hlp":
				case "chm":
					ext = "application/mshelp";
					break;
				case "ppt":
				case "ppz":
				case "pps":
				case "pot":
					ext = "application/mspowerpoint";
					break;
				case "doc":
				case "dot":
					ext = "application/msword";
					break;
				case "bin":
				case "exe":
				case "com":
				case "dll":
				case "class":
					ext = "application/octet-stream";
					break;
				case "oda":
					ext = "application/oda";
					break;
				case "pdf":
					ext = "application/pdf";
					break;
				case "ai":
				case "eps":
				case "ps":
					ext = "application/postscript";
					break;
				case "rtc":
					ext = "application/rtc";
					break;
				case "rtf":
					ext = "application/rtf";
					break;
				case "smp":
					ext = "application/studiom";
					break;
				case "tbk":
					ext = "application/toolbook";
					break;
				case "vmd":
					ext = "application/vocaltec-media-desc";
					break;
				case "vmf":
					ext = "application/vocaltec-media-file";
					break;
				case "xlsx":
					ext = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					break;
				case "docx":
					ext = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					break;
				case "xhtml":
					ext = "application/xhtml+xml";
					break;
				case "xml":
					ext = "application/xml";
					break;
				case "bcpio":
					ext = "application/x-bcpio";
					break;
				case "z":
					ext = "application/x-compress";
					break;
				case "cpio":
					ext = "application/x-cpio";
					break;
				case "csh":
					ext = "application/x-csh";
					break;
				case "dcr":
				case "dir":
				case "dxr":
					ext = "application/x-director";
					break;
				case "dvi":
					ext = "application/x-dvi";
					break;
				case "evy":
					ext = "application/x-envoy";
					break;
				case "gtar":
					ext = "application/x-gtar";
					break;
				case "hdf":
					ext = "application/x-hdf";
					break;
				case "php":
				case "phtml":
					ext = "application/x-httpd-php";
					break;
				case "latex":
					ext = "application/x-latex";
					break;
				case "bin":
					ext = "application/x-macbinary";
					break;
				case "mif":
					ext = "application/x-mif";
					break;
				case "nc":
				case "cdf":
					ext = "application/x-netcdf";
					break;
				case "nsc":
					ext = "application/x-nschat";
					break;
				case "sh":
					ext = "application/x-sh";
					break;
				case "shar":
					ext = "application/x-shar";
					break;
				case "swf":
				case "cab":
					ext = "application/x-shockwave-flash";
					break;
				case "spr":
				case "sprite":
					ext = "application/x-sprite";
					break;
				case "sit":
					ext = "application/x-stuffit";
					break;
				case "sca":
					ext = "application/x-supercard";
					break;
				case "tar":
					ext = "application/x-tar";
					break;
				case "tcl":
					ext = "application/x-tcl";
					break;
				case "tex":
					ext = "application/x-tex";
					break;
				case "texinfo":
				case "texi":
					ext = "application/x-texinfo";
					break;
				case "t":
				case "tr":
				case "roff":
					ext = "application/x-troff";
					break;
				case "man":
				case "troff":
					ext = "application/x-troff-man";
					break;
				case "me":
				case "troff":
					ext = "application/x-troff-me";
					break;
				case "me":
				case "troff":
					ext = "application/x-troff-ms";
					break;
				case "ustar":
					ext = "application/x-ustar";
					break;
				case "src":
					ext = "application/x-wais-source";
					break;
				case "zip":
					ext = "application/zip";
					break;
				case "au":
				case "snd":
					ext = "audio/basic";
					break;
				case "es":
					ext = "audio/echospeech";
					break;
				case "tsi":
					ext = "audio/tsplayer";
					break;
				case "vox":
					ext = "audio/voxware";
					break;
				case "aif":
				case "aiff":
				case "aifc":
					ext = "audio/x-aiff";
					break;
				case "dus":
				case "cht":
					ext = "audio/x-dspeeh";
					break;
				case "mid":
				case "midi":
					ext = "audio/x-midi";
					break;
				case "ram":
				case "ra":
					ext = "audio/x-pn-realaudio";
					break;
				case "rpm":
					ext = "audio/x-pn-realaudio-plugin";
					break;
				case "stream":
					ext = "audio/x-qt-stream";
					break;
				case "wav":
					ext = "audio/x-wav";
					break;
				case "dwf":
					ext = "drawing/x-dwf";
					break;
				case "cod":
					ext = "image/cis-cod";
					break;
				case "ras":
					ext = "image/cmu-raster";
					break;
				case "fif":
					ext = "image/fif";
					break;
				case "gif":
					ext = "image/gif";
					break;
				case "ief":
					ext = "image/ief";
					break;
				case "jpeg":
				case "jpg":
				case "jpe":
					ext = "image/jpeg";
					break;
				case "png":
					ext = "image/png";
					break;
				case "tiff":
				case "tif":
					ext = "image/tiff";
					break;
				case "mcf":
					ext = "image/vasa";
					break;
				case "wbmp":
					ext = "image/vnd.wap.wbmp";
					break;
				case "ico":
					ext = "image/x-icon";
					break;
				case "pnm":
					ext = "image/x-portable-anymap";
					break;
				case "pbm":
					ext = "image/x-portable-bitmap";
					break;
				case "pgm":
					ext = "image/x-portable-graymap";
					break;
				case "ppm":
					ext = "image/x-portable-pixmap";
					break;
				case "rgb":
					ext = "image/x-rgb";
					break;
				case "xwd":
					ext = "image/x-windowdump";
					break;
				case "xbm":
					ext = "image/x-xbitmap";
					break;
				case "xpm":
					ext = "image/x-xpixmap";
					break;
				case "wrl":
					ext = "model/vrml";
					break;
				case "csv":
					ext = "text/comma-separated-values";
					break;
				case "css":
					ext = "text/css";
					break;
				case "htm":
				case "html":
				case "shtml":
					ext = "text/html";
					break;
				case "js":
					ext = "text/javascript";
					break;
				case "txt":
					ext = "text/plain";
					break;
				case "rtx":
					ext = "text/richtext";
					break;
				case "rtf":
					ext = "text/rtf";
					break;
				case "tsv":
					ext = "text/tab-separated-values";
					break;
				case "wml":
					ext = "text/vnd.wap.wml";
					break;
				case "wmlc":
					ext = "application/vnd.wap.wmlc";
					break;
				case "wmls":
					ext = "text/vnd.wap.wmlscript";
					break;
				case "wmlsc":
					ext = "application/vnd.wap.wmlscriptc";
					break;
				case "xml":
					ext = "text/xml";
					break;
				case "etx":
					ext = "text/x-setext";
					break;
				case "sgm":
				case "sgml":
					ext = "text/x-sgml";
					break;
				case "talk":
				case "spc":
					ext = "text/x-speech";
					break;
				case "mpeg":
				case "mpg":
				case "mpe":
					ext = "video/mpeg";
					break;
				case "qt":
				case "mov":
					ext = "video/quicktime";
					break;
				case "viv":
				case "vivo":
					ext = "video/vnd.vivo";
					break;
				case "avi":
					ext = "video/x-msvideo";
					break;
				case "movie":
					ext = "video/x-sgi-movie";
					break;
				case "vts":
				case "vtts":
					ext = "workbook/formulaone";
					break;
				case "wrl":
					ext = "x-world/x-vrml";
					break;
				case "svg":
					ext = "image/svg+xml";
					break;
			}
			return ext;
	}; 
}
