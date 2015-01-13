
// form validator

var zForm = {};



// fields
zForm.fields = 'input:not([type="button"],[type="submit"]),' + 
			   'select,' +
			   'textarea';



// check
zForm.checkForm = function ( form ) {
	var errorsArr = [];

	// check field values
	form.find ( zForm.fields ).each ( function () {
		for ( var i in zForm.check ) {
			var checkResult = zForm.check[i] ( $(this) );
			if ( checkResult.result == 'ERROR' ) {
				errorsArr.push ( checkResult.answer );
				break;
			}
		}
	});

	return errorsArr;
};

// check functions
zForm.check = {};

// check required
zForm.check.checkRequired = function ( field ) {
	if ( field.prop ( 'required' ) ) {
		var fieldType = field.attr ( 'type' );
		if ( fieldType && fieldType.toLowerCase() == 'checkbox' ) {
			if ( ! field.prop ( 'checked' ) ) {
				var fieldName = field.attr ( 'name' );
				var response = {
					result: 'ERROR'
				};
				if ( fieldName in zForm.defaultValue.msg.error.checkbox ) {
					response.answer = zForm.defaultValue.msg.error.checkbox[fieldName];
				} else {
					response.answer = zForm.defaultValue.msg.error.checkbox.default;
				}
				return response;
			}
		} else if ( fieldType && fieldType.toLowerCase() == 'radio' ) {
			var fieldName = field.attr ( 'name' );
			var radioValue = $( 'input:radio[name="' + fieldName + '"]:checked' ).val();
			if ( ! radioValue ) {
				var response = {
					result: 'ERROR'
				};
				if ( fieldName in zForm.defaultValue.msg.error.radio ) {
					response.answer = zForm.defaultValue.msg.error.radio[fieldName];
				} else {
					response.answer = zForm.defaultValue.msg.error.radio.default;
				}
				return response;
			}
		} else {
			if ( field.val() == '' ) {
				return {
					result: 'ERROR',
					answer: zForm.defaultValue.msg.error.field.empty.replace ( '{field_name}', msg.field[field.attr ( 'name' )] )
				};
			}
		}
	}
	return {
		result: 'OK'
	};
};

// check min length
zForm.check.checkMinLength = function ( field ) {
	var min = field.attr ( 'minlength' );
	if ( min ) {
		if ( field.val().length < min ) {
			return {
				result: 'ERROR',
				answer: zForm.defaultValue.msg.error.field.incorrect.replace ( '{field_name}', msg.field[field.attr ( 'name' )] )
			};
		}
	}
	return {
		result: 'OK'
	};
};

// check max length
zForm.check.checkMaxLength = function ( field ) {
	var max = field.attr ( 'maxlength' );
	if ( max ) {
		if ( field.val().length > max ) {
			return {
				result: 'ERROR',
				answer: zForm.defaultValue.msg.error.field.incorrect.replace ( '{field_name}', msg.field[field.attr ( 'name' )] )
			};
		}
	}
	return {
		result: 'OK'
	};
};

// check pattern
zForm.check.checkPattern = function ( field ) {
	var pattern = field.attr ( 'pattern' );
	if ( pattern ) {
		var regExp = new RegExp ( pattern, 'i' );
		if ( ! regExp.test ( field.val() ) ) {
			return {
				result: 'ERROR',
				answer: zForm.defaultValue.msg.error.field.incorrect.replace ( '{field_name}', msg.field[field.attr ( 'name' )] )
			};
		}
	}
	return {
		result: 'OK'
	};
};

// array to string
zForm.arrayToString = function ( arr ) {
	var tag = zForm.defaultValue.handlerErrorTag;
	if ( tag == '\n' ) {
		return arr.join ( tag );
	}
	return '<' + tag + '>' + arr.join ( '</' + tag + '><' + tag + '>' ) + '</' + tag + '>';
};



// add usual submit
zForm.addUsualSubmit = function ( form ) {
	form.submit ( function () {
		if ( $(this).hasClass ( 'validate' ) ) {
			var errorsArr = zForm.checkForm ( $(this) );
			if ( errorsArr.length == 0 ) {
				return true;
			} else {
				zForm.defaultValue.handlerError ( zForm.arrayToString ( errorsArr ) );
				return false;
			}
		}
		return true;
	});
};

// add ajax submit
zForm.addAjaxHandler = function ( selector, handlerOk ) {

	var defVal = zForm.defaultValue;

	var params = {
		'_selector': defVal.ajaxSelector,
		'handlerError': defVal.handlerError,
		'default': defVal.handlerDefault
	};

	// selector and handlerOk
	if ( arguments.length == 2 ) {
		params._selector = selector;
		params.ok = handlerOk;
	} else {

		// handlerOk
		if ( typeof ( arguments[0] ) == 'function' ) {
			params.ok = arguments[0];
		} else {

			// object
			for ( var i in arguments[0] ) {
				params[i] = arguments[0][i];
			}
		}
	}

	// add form ajax submit
	$( params._selector ).each ( function () {
		var form = $(this);

		if ( form.hasClass ( 'validate' ) ) {
			$(this).attr ( 'novalidate', 'novalidate' );
		}

		// form submit
		form.submit ( function () {

			// check form
			if ( form.hasClass ( 'validate' ) ) {
				var errorsArr = zForm.checkForm ( form );
				if ( errorsArr.length != 0 ) {
					params.handlerError ( zForm.arrayToString ( errorsArr ) );
					return false;
				}
			}

			// set current form
			zForm.currentAjaxForm = form;

			// start before functions
			if ( '_before' in params ) {
				params._before();
			}

			// send ajax
			$.ajax({
				url: form.attr ( 'action' ),
				data: zForm.getFormData ( form ),
				dataType: 'json',
				type: form.attr ( 'method' ),
				success: function ( response ) {

					// set current form
					zForm.currentAjaxForm = form;
					// set current response
					zForm.currentAjaxResponse = response;

					// start pre-response action
					if ( '_preResponse' in params ) {
						params._preResponse();
					}

					// result handler
					for ( var j in params ) {
						if ( j.toUpperCase() == response.result ) {
							params[j]();
							return;
						}
					}

					// default handler
					params.default();

				}
			});

			return false;
		});
	});
};

// get form data
zForm.getFormData = function ( form ) {
	var formData = [];
	form.find ( zForm.fields ).each ( function () {
		formData.push ( encodeURIComponent ( $(this).attr ( 'name' ) ) + '=' + encodeURIComponent ( $(this).val() ) );
	});
	return formData.join ( '&' );
};



// default values
zForm.defaultValue = {

	// selectors
	ajaxSelector: 'form.ajax',

	// messages
	msg: msg,

	// error handler
	handlerError: function ( msg ) {
		console.log ( msg );
	},
	handlerErrorTag: '\n',

	// default handler
	handlerDefault: function () {
		console.log ( zForm.currentAjaxResponse );
	}
};



// init
zForm.init = function ( initObj ) {

	// set init data and default values
	if ( initObj ) {
		for ( var i in initObj ) {
			zForm.defaultValue[i] = initObj[i];
		}
	}

	// add form submit event
	$( 'form' ).each ( function () {

		// disable validate if needed
		if ( $(this).hasClass ( 'validate' ) ) {
			$(this).attr ( 'novalidate', 'novalidate' );

			if ( ! $(this).hasClass ( 'ajax' ) ) {
				zForm.addUsualSubmit ( $(this) );
			}
		}
		
	});
	
};