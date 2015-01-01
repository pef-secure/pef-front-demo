
// loader

var loader = {};


// show
loader.show = function ( id ) {
	$( '#loader_' + id ).removeClass ( 'hidden' );
};

// hide
loader.hide = function ( id ) {
	$( '#loader_' + id ).addClass ( 'hidden' );
};