var zFormz = {};
// fields
zFormz.fields = 'input:not([type="button"][type="submit"]),select,textarea';

// get form data
zFormz.getFormData = function(form) {
	var formData = [];
	form.find(zFormz.fields).each(
		function() {
			formData.push(encodeURIComponent($(this).attr('name')) + '=' + encodeURIComponent($(this).val()));
	});
	return formData.join('&');
};

zFormz.checkForm = function(form) {
	return true;
}

zFormz.default_reactor_others = function() {
	popup.show ( zFormz.response.result + ': ' + zFormz.response.answer );
}

zFormz.ajax = function(id_form, reactor_ok, reactor_others) {
	var form = $("#" + id_form);
	if (typeof reactor_others === "undefined") {
		reactor_others = zFormz.default_reactor_others;
	}
	form.submit ( function () {
		if(zFormz.checkForm(form)) {
			$.ajax({
				url:      form.attr('action'),
				data:     zFormz.getFormData(form),
				type:     form.attr('method'),
				dataType: 'json',
				success:  function(response) {
					zFormz.response = response;
					switch ( zFormz.response.result ) {
					case 'OK':
						reactor_ok();
						break;
					default:
						reactor_others();
					}
				}
			});
		}
		return false;
	});
}