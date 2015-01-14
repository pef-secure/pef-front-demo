
// login form

// init (autorun)
if ( $( '#login_form' ).length > 0 ) {

	// add ajax handler
	zForm.addAjaxHandler ({

		// form selector
		_selector: '#login_form', // optional

		// action before sending a response
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

};