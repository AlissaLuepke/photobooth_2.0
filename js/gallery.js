var carousel;
var timeline;
var counter = 0;
var last_year = 0;
var last_month = 0;
var last_day = 0;
var last_hour = 0;

var months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

// AJAX Request --> Holen der Bilder
$.ajax({
    url: "/dir",
    method: "GET",
    dataType: "json"
    
}).done(function(message){
	  
	  for(var x in message){
	      
	      $.ajax({
		  url: "/photos/"+message[x],
		  method: "GET",
		  async: false	// die synchrone Ausführung sorgt hier dafür, dass die per Dateiname schon geordnete Reihenfolge erhalten bleibt
	      
	      }).done(function(message2) {

		var date = message[x].split(".")[0].split("_");
		var year = date[0];
		var month = date[1];
		var day = date[2];
		var hour = date[3];
		var minute = date[4];
		
		if (+year > last_year ) {
			last_year = +year;
			last_month = 0;
			appendTimeList( counter, year, "time_year");
		}
		if (+month > last_month ) {
			last_month = +month;
			last_day = 0;
			appendTimeList( counter, months[+month ], "time_month");
		}
		if (+day > last_day ) {
			last_day = +day;
			last_hour = 0;
			appendTimeList( counter, day + ".", "time_day");
		}
		if (+hour > last_hour ) {
			last_hour = +hour;
			appendTimeList( counter, hour + ":00", "time_hour");
		}
		var text = message2.text == "" ? "." : message2.text;
	      	var temp = "<li class='gallery_image'>";
		temp += "<img class='gallerysize' src='"+decodeURIComponent(message2.img)+"'>";
		temp += "<p class='font_" + message2.font + "' " + (text == "." ? "style='color: white;'" : "") + ">" + decodeURIComponent(decodeURI(text)) + "</p>";
		//temp += "<p class='date_text'>" + day + "." + month + "." + year + " " + hour + ":" + minute  + "</p>";
		temp += "</li>";
		$('#carousel_list').append(temp);
		counter++;
		
		if ( counter == message.length ) {
		  	carousel = $("#carousel").flipster({
			    style: 'carousel',
			    spacing: -0.5,
			    nav: false,
			    buttons: true,
			    loop: true,
			    
			    start: 0
			});
			
			timeline = $("#flat").flipster({
			    style: 'flat',
			    spacing: -0.15,
			   
			    start: 0
			});
			
			$('.galleryfoldersize').click(function(){
			    	carousel.flipster('jump', +$(this).attr("imageID")); // Jump to a specific index
			});
		  }
	      });
	  }
	  
});

function appendTimeList(id, text, type) {
	$('#flat_list').append('<li><div class="galleryfoldersize ' + type + '" imageID=' + id +' > <p class="foldertext"> ' + text + ' </p></div></li>');
}




