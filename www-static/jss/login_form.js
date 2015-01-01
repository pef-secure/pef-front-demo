
// login form

var loginForm = {};


// elements
loginForm.form = $( '#login_form' );
loginForm.login = $( '#login' );
loginForm.password = $( '#password' );


// check form
loginForm.check = function () {
	var errors = '';

	if ( loginForm.login.val() == '' ) {
		errors += msg.fieldIsEmpty.replace ( '[% field_name %]', msg.login );
	}
	if ( loginForm.password.val() == '' ) {
		errors += msg.fieldIsEmpty.replace ( '[% field_name %]', msg.password );
	}

	return errors;
};

// send form
loginForm.send = function () {
	$.ajax({
		type: 'POST',
		url: loginForm.form.attr ( 'action' ),
		data: 'login=' + loginForm.login.val() + '&password=' + loginForm.password.val(),
		success: function ( response ) {
			loader.hide ( 'login' );
			response = JSON.parse ( response );
			switch ( response.result ) {
				case 'OK':
					window.location.reload();
					break;
				default:
					popup.show ( response.result + ': ' + response.answer );
			}
		}
	});
};



// init
loginForm.init = function () {

	// send btn click
	$( '#login_send_btn' ).click ( function () {
		loader.show ( 'login' );
	});

	// form sumit
	loginForm.form.submit ( function () {
		var errors = loginForm.check();
		if ( errors == '' ) {
			loginForm.send();
		} else {
			loader.hide ( 'login' );
			popup.show ( errors );
		}
		return false;
	});

};


// autorun
if ( loginForm.form.length > 0 ) {
	loginForm.init();
}