
$(document).ready(function () {
		$('#titletext').css("transition", "letter-spacing 3s");
		$('#titletext').css("letter-spacing", "0px");
    	});

$('.Infobutton').click(function(){

    $('.infowindow-hidden').toggleClass('infowindow');
}
  );


$('.closebutton').click(function(){

    $('.infowindow-hidden').toggleClass('infowindow');
}
  );
