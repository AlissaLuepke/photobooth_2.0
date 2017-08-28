var settings;
var counter = 0;

/*$( '#shoot' ).mouseenter( function () {
	$('.ausloesebutton').attr("src","img/buttons/Ausloeser_Pressed_mitBlitz_new.svg");
} ).mouseleave( function () {
	$('.ausloesebutton').attr("src","img/buttons/Ausloeser_Pressed_ohneBlitz_new.svg");
} );*/

$('#shoot').click(function() {
     $('#capture').val($('#capture').val() + 0.5); 
     var timer = setInterval(function () {
     	let time = $('#capture').val();
     	$('#capture').val((time - 0.1).toFixed(1));
     	if ( time <= 1 ) {
     		$('#capture').css("color","red");
     	} else {
     		$('#capture').css("color","black");
     	}
     	if (time <= 0) clearInterval(timer);
     }, 100);
    
	$.ajax({
		method: "POST",
		url: "/",
		data: $('#shootForm').serialize()
	}).done( function (msg) {
		location.href = "/index.html";
	});
});


			
$(document).ready(function () {
	$.ajax({
		method: "POST",
		url: "/settings"
	}).done( function (msg) {
		if (msg.status == "error") {
			$('#preview').attr("src","img/keine-kamera.png");
			$('#shoot').unbind().css("cursor","not-allowed");
		} else {
			$.ajax({
				method: "GET",
				url: "/start"
			}).done( function (msg) {
				setInterval(function () {
					$('#preview').attr("src", "/buffer" + "?" + counter);
					counter = counter + 1;
				}, 100);
			});
		}
	});
});

window.onbeforeunload = function (e) {
	$.ajax({
		method: "GET",
		url: "/stop"
	})
};
