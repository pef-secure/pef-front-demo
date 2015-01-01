
// add article

var addArticle = {};


// elements
addArticle.form = $( '#add_article_form' );
addArticle.title = $( '#title' );
addArticle.content = $( '#content' );


// check form
addArticle.check = function () {
	var errors = '';

	if ( addArticle.title.val() == '' ) {
		errors += msg.fieldIsEmpty.replace ( '[% field_name %]', msg.title );
	}
	if ( addArticle.content.val() == '' ) {
		errors += msg.fieldIsEmpty.replace ( '[% field_name %]', msg.content );
	}

	return errors;
};

// send form
addArticle.send = function () {
	$.ajax({
		type: 'POST',
		url: addArticle.form.attr ( 'action' ),
		data: 'title=' + addArticle.title.val() + '&content=' + addArticle.content.val(),
		success: function ( response ) {
			loader.hide ( 'add_article' );
			response = JSON.parse ( response );
			switch ( response.result ) {
				case 'OK':
					window.location = '/appArticle/' + response.id_article;
					break;
				default:
					popup.show ( response.result + ': ' + response.answer );
			}
		}
	});
};



// init
addArticle.init = function () {

	// send btn click
	$( '#add_article_send_btn' ).click ( function () {
		loader.show ( 'add_article' );
	});

	// form sumit
	addArticle.form.submit ( function () {
		var errors = addArticle.check();
		if ( errors == '' ) {
			addArticle.send();
		} else {
			loader.hide ( 'add_article' );
			popup.show ( errors );
		}
		return false;
	});

};


// autorun
if ( addArticle.form.length > 0 ) {
	addArticle.init();
}