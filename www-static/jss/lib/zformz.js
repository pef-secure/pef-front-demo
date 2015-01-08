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

zFormz.ajax = function(id_form, reactor) {
	var form = $("#" + id_form);
	form.submit ( function () {
		if(zFormz.checkForm(form)) {
			$.ajax({
				url:      form.attr('action'),
				data:     zFormz.getFormData(form),
				type:     form.attr('method'),
				dataType: 'json',
				success:  function(response) {
					ajax.response = response;
					reactor();
				}
			});
		}
		return false;
	});
}