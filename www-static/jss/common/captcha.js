
// captcha

var captcha = {};


captcha.group = {};
captcha.updateUrl = '';
captcha.picPath = '';



// update
captcha.update = function ( captchaId ) {
	$.ajax({
		url: captcha.updateUrl,
		dataType: 'json',
		type: 'post',
		success: function ( response ) {
			switch ( response.result ) {
				case 'OK':
					captcha.group[captchaId].btn.removeClass ( 'transparent' );
					captcha.group[captchaId].pic.attr ( 'src', captcha.picPath + response.code + '.jpg' );
					captcha.group[captchaId].hash.val ( response.code );
					var field = captcha.group[captchaId].field;
					field.val ( '' );
					field.focus();
					break;
				default:
					popup.show ( response.result + ': ' + response.answer );
			}
			
		}
	});
};


// init
captcha.init = function ( updateUrl, picPath ) {

	// set update url and pic path
	captcha.updateUrl = updateUrl;
	captcha.picPath = picPath;

	// reload btn click
	$( 'input.captcha-reload-btn' ).each ( function () {

		// fill captcha group
		var id = $(this).attr ( 'id' );
		var clearId = id.replace ( 'captcha_reload_btn', '' );
		captcha.group[id] = {};
		captcha.group[id].btn = $(this);
		captcha.group[id].hash = $( '#captcha_hash' + clearId );
		captcha.group[id].pic = $( '#captcha_pic' + clearId );
		captcha.group[id].field = $( '#captcha' + clearId );

		// add btn click
		$(this).click ( function () {
			$(this).addClass ( 'transparent' );
			captcha.update ( $(this).attr ( 'id' ) );
		});
	});

};