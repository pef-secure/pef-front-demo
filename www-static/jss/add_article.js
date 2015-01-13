// autorun
if ( $( '#add_article_form' ).length > 0 ) {
	zForm.addAjaxHandler ({

		// action before sending request
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
}