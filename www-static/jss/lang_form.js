// autorun
if ( $( 'form.lang' ).length > 0 ) {
	zForm.addAjaxHandler ({
		_selector: 'form.lang', // optional
		ok: function () {
			window.location.reload();
		}
	});
}