
// zform init
zForm.init ({
	msg: msg, // optional
	handlerError: popup.show, // optional
	handlerErrorTag: 'p', // optional
	handlerDefault: function () { // optional
		var response = zForm.currentAjaxResponse;
		popup.show ( response.result + ': ' + response.answer );
	}
});