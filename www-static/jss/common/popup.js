
// popup

var popup = {};


// elements
popup.box = $( '#popup_box' );
popup.content = $( '#popup_text' );


// show
popup.show = function ( text ) {
	popup.content.html ( text );
	popup.box.removeClass ( 'hidden' );
};

// hide
popup.hide = function ( text ) {
	popup.box.addClass ( 'hidden' );
};


// init
popup.init = function () {

	// background click
	$( '#popup_bg' ).click ( function () {
		popup.hide();
	});

	// close btn click
	$( '#popup_close_btn' ).click ( function () {
		popup.hide();
	});
	
};


// autorun
if ( popup.box.length > 0 ) {
	popup.init();
}