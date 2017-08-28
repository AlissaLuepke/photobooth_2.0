var stickers = [
	"Anker",
	"Augenklappe",
	"Brille",
	"Bunny",
	"Clownsnase",
	"Damenhut",
	//"Denkblase_blanco",
	"Denkblase_OMG",
	"Denkblase_WTF",
	"Herzal",
	"Krawatte",
	"Kullerauge",
	"Kussmund",
	"Monokel",
	"Narbe",
	"Pfeife",
	"Schleife",
	"Schnurrbart_mitZahn",
	"Schnurrbart",
	//"Sprechblase_blanco",
	"Sprechblase_OMG",
	"Sprechblase_WTF",
	"Vollbart",
	"Zylinder"
];

class FilterType {
    constructor(name, func) {
        this.name = name;
        this.func = func;
    }
}

function saveFunction ( ) {
    var theText = encodeURIComponent($('#text').val());
    console.log(theText);
    $.ajax({
        url: "/"
        , method: "POST"
        , data: {
            save: canvas.toDataURL('png')
            , text: theText
            , font: $('#font').val()
        }
    }).done(function (msg) {
        location.href = "/gallery.html";
    });
}

// neues Canvas Element wurde erstellt 
var canvas = new fabric.Canvas('canvas', {
    backgroundColor: 'rgb(239, 239, 239)'
    , selectionColor: 'black'
    , selectionLineWidth: 2
    , selectionBorderColor: 'black'
    , selectionLineWidth: 2
});
$(window).resize(function () {
    var imagewidth = $('#preview-container').width();
    $('#preview-container').height(imagewidth / 1.25);
    $('#preview-container').css('min-height', imagewidth / 1.25);
    var ratio =  (imagewidth - 50) / canvas.width;
    canvas.setWidth(imagewidth - 50);
    canvas.setHeight((imagewidth - 50) * 0.66);
    for (var x in canvas.getObjects()) {
    	if (x == 0) {
	    	x = canvas.getObjects()[x];
    		var imgSize = canvas.width / x.width;
    		x.scaleX = imgSize;
    		x.scaleY = imgSize;
    		continue;
    	}
    	x = canvas.getObjects()[x];
    	x.scaleX *= ratio;
    	x.scaleY *= ratio;
    	x.top *= ratio;
    	x.left *= ratio;
    }
    canvas.renderAll();
});
// Aufgenommenes Bild der Kamera wird dynamisch zum Canvas hinzugefügt
//fabric.Image.fromURL('img/1036476_8332460.jpg', function (oImg) {
var canvas_image = fabric.Image.fromURL('capture.jpg', function (oImg) {
    wImg = oImg.getOriginalSize().width;
    wCan = canvas.width;
    oImg.scale(wCan / wImg);
    oImg.selectable = false;
    canvas.add(oImg);
    // Anwendung des Filter auf das Bild
    $(function () {
        $('.filters').on("change", "input", function () {
            var id = $(this).data("filter");
            var isChecked = ($(this).prop("checked") || id >= 0);
            /*if (filter == 5) {
                console.log("duh...");
                oImg.filters[filter] = new fabric.Image.filters.Saturate({
                        saturate: $('#saturation').val()
                    });
                oImg.applyFilters(function () {
                    canvas.renderAll();
                });
                
            } else { */
            current = filters[id];
            oImg.filters[id] = isChecked ? current.func : null;
            if (isChecked) oImg.filters[id][current.name] = parseInt($('#' + current.name).val(), 10);
            oImg.applyFilters(function () {
                canvas.renderAll();
            });
            //}
        });
    });
});
// Hinzufügen des bxSliders
$(document).ready(function () {
	/// STICKER
	for ( var x in stickers) {
		x = stickers[x];
		$('.sliderSticker').append('<li class="slide"><img id="' + x + '"  alt="self-Logo" src="img/svg_sticker/' + x + '.svg"></li>'); //<div class="slide"></div>
		$("#" + x).click(function () {
		    fabric.loadSVGFromURL('img/svg_sticker/' + $(this).attr("id") + '.svg', function (objects, options) {
			var obj = fabric.util.groupSVGElements(objects, options);
			canvas.add(obj).renderAll();
		    });
		});
	}

	$('.sticker-container').flipster({
	    	style: 'flat',
		spacing: -0.15,
		start: "center",
		buttons: true
	});
	$(window).resize();
});

$("#target").click(function () {
    var selected = canvas.getActiveObject();
    canvas.remove(selected);
});
//Speichern des neuen Bildes
$("#Upload").click(function () {
	saveFunction();
});

/// Filter Slider (Helligkeit, Kontrast etc.)
var rangeSlider = function () {
    var slider = $('.range-slider')
        , range = $('.range-slider__range')
        , value = $('.range-slider__value');
    slider.each(function () {
        value.each(function () {
            var value = $(this).prev().attr('value');
            $(this).html(value);
        });
        range.on('input', function () {
            $(this).next(value).html(this.value);
        });
    });
};
rangeSlider();
var filters = [

    new FilterType("contrast", new fabric.Image.filters.Contrast({
        contrast: 0
    }))
    , new FilterType("blocksize", new fabric.Image.filters.Pixelate({
        blocksize: 0
    }))
    , new FilterType("saturate", new fabric.Image.filters.Saturate({
        saturate: 0
    }))
    , new FilterType("brightness", new fabric.Image.filters.Brightness({
        brightness: 0
    }))


];
$('#text').keyup(function () {
    $('#font option').html($(this).val());
    $('#subtext').html($(this).val());
    changeFont();
});
$('#font').change(function () {
    changeFont();
});

$('.gallerybutton').mouseover( function(){
      $(this).attr('src','img/buttons/Gallery_pressed_new.svg')
    });

function changeFont() {
    $('#subtext').removeClass(function () {
        return $(this).attr("class");
    });
    $('#subtext').addClass("font_" + $('#font').val());
    $('#font').removeClass(function () {
        return $(this).attr("class");
    });
    $('#font').addClass("font_" + $('#font').val());
}

$('#delete').click(function () {
	canvas.getActiveObject().remove();
});

function onObjectSelected ( e ) {
	$('#delete').css("fill", "");
	$('#Kreis ellipse').css("fill","");
	$('#delete').unbind().click(function () {
		canvas.getActiveObject().remove();
	});
	
	$('#Upload path').css("fill","#797979");
	$('#save').css("fill","#ababab");
	$('#Upload').unbind();
	
	$('input').attr("disabled", true);
	$('select').attr("disabled", true);
	$('.filters').addClass("disabled");
}
function onObjectDeselected () {
	$('#delete').css("fill", "#797979");
	$('#Kreis ellipse').css("fill","ababab");
	$('#delete').unbind();
	
	$('#Upload path').css("fill","");
	$('#save').css("fill","");
	$("#Upload").unbind().click(function () {
		saveFunction();
	});
	
	$('input').attr("disabled", false);
	$('select').attr("disabled", false);
	$('.filters').removeClass("disabled");
}
canvas.on('object:selected', onObjectSelected);
canvas.on('selection:cleared', onObjectDeselected);


document.addEventListener("DOMContentLoaded", function () {
    wait();
    onObjectDeselected();
});

function wait() {
    console.log("Function Called");
    var e = document.getElementById('flex-container');
    //e.preventDefault();
    //e.className = e.className + " waited";
};
