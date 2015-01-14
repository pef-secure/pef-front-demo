
// lang form

var langForm = {};


// get btn
langForm.getBtn = function () {
	return zForm.currentAjaxForm.find ( 'input[type="submit"]' );
};


// init
langForm.init = function () {

	// lang form init
	zForm.addAjaxHandler ({

		_selector: 'form.lang', // optional

		// action before sending a request
		_before: function () { // optional
			var btn = langForm.getBtn();
			btn.addClass ( 'transparent' );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			var btn = langForm.getBtn();
			btn.removeClass ( 'transparent' );
		},

		// results
		ok: function () {
			window.location.reload();
		}
	});
};


// autorun
if ( $( '#langs' ).length > 0 ) {
	langForm.init();
}