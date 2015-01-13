// autorun
if ( $( '#login_form' ).length > 0 ) {
	// add ajax handler
	zForm.addAjaxHandler ({

		// form selector
		_selector: '#login_form', // optional

		// action before sending request
		_before: function () { // optional
			loader.show ( 'login' );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			loader.hide ( 'login' );
		},

		// results
		ok: function () {
			window.location.reload();
		}
	});
} else if($( '#logout_form' ).length > 0 ) {
	zForm.addAjaxHandler ('#logout_form', function () { window.location.reload(); });
}