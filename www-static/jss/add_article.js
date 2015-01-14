
// add article

// init (autorun)
if ( $( '#add_article_form' ).length > 0 ) {

	// add ajax handler
	zForm.addAjaxHandler ({

		// action before sending a response
		_before: function () { // optional
			loader.show ( 'add_article' );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			loader.hide ( 'add_article' );
		},

		// results
		ok: function () {
			window.location = '/article/' + zForm.currentAjaxResponse.id_article;
		}
	});

};