
// article

var article = {};


// properties
article.depthMargin = 20;


// elements
article.userNameFld = $( '#user_name' );
if ( article.userNameFld.length > 0 ) {
	article.userName = article.userNameFld.html();
}

article.mainIdArticleFld = $( '#main_id_article' );
if ( article.mainIdArticleFld.length > 0 ) {
	article.mainIdArticle = article.mainIdArticleFld.val();
}


article.commentsNumber = $( '#comments_number' );
article.leaveCommentForArticleLink = $( '#leave_comment_for_article' );

article.commentsBox = $( '#comments' );
article.commentFormBox = $( '#comment_form_box' );
article.commentForm = {};
article.commentForm.form = $( '#leave_comment_form' );
//article.commentForm.author = $( '#author' );
article.commentForm.idArticle = $( '#id_article' );
article.commentForm.idCommentParent = $( '#id_comment_parent' );
article.commentForm.captchaHash = $( '#captcha_hash_1' );
article.commentForm.comment = $( '#comment' );
article.commentForm.captcha = $( '#captcha_1' );

article.commentTemplate = $( '#comment_template_box' ).html();



// get comment id
article.getCommentId = function () {
	return zForm.currentAjaxForm.find ( 'input[name="id_comment"]' ).val();
};


// show comment form
article.showCommentForm = function ( commentFor, id, insertAfterElem ) {
	article.commentForm.comment.val ( '' );
	article.commentForm.captcha.val ( '' );

	if ( commentFor == 'comment' ) {
		article.commentForm.idArticle.val ( '' );
		article.commentForm.idCommentParent.val ( id );
		article.commentFormBox.insertAfter ( insertAfterElem );
	}
	if ( commentFor == 'article' ) {
		article.commentForm.idCommentParent.val ( '' );
		article.commentForm.idArticle.val ( id );
		article.commentFormBox.insertBefore ( article.commentsBox );
	}

	article.commentFormBox.removeClass ( 'hidden' );
	article.commentForm.comment.focus();
};

// hide comment form
article.hideCommentForm = function ( commentFor, id ) {
	article.commentFormBox.addClass ( 'hidden' );
	article.commentFormBox.insertAfter ( article.commentsBox );
};


// build comment
article.buildComment = function () {
	var commentId = zForm.currentAjaxResponse.id_comment;
	var currentDate = new Date();
	currentDate = article.addZero ( currentDate.getDate() ) + '-' + 
				  article.addZero ( currentDate.getMonth() + 1 ) + '-' + 
				  currentDate.getFullYear() + ' ' + 
				  article.addZero ( currentDate.getHours() ) + ':' + 
				  article.addZero ( currentDate.getMinutes() ) + ':' + 
				  article.addZero ( currentDate.getSeconds() );
	
	var commentHtml = article.commentTemplate;
	commentHtml = commentHtml.replace ( /__id__/g, commentId );
	commentHtml = commentHtml.replace ( /__author__/, article.userName );
	commentHtml = commentHtml.replace ( /__date__/, currentDate );
	commentHtml = commentHtml.replace ( /__text__/, article.commentForm.comment.val() );

	if ( article.commentForm.idArticle.val() == '' ) {
		var insertAfterComment = $( '#comment_' + article.commentForm.idCommentParent.val() );
		var insertAfterCommentDepth = parseInt ( insertAfterComment.css ( 'margin-left' ), 10 ) + article.depthMargin;
		commentHtml = commentHtml.replace ( /__depth__/, insertAfterCommentDepth );
		insertAfterComment.after ( commentHtml );
	} else {
		commentHtml = commentHtml.replace ( /__depth__/, '0' );
		article.commentsBox.append ( commentHtml );
	}
};

// update comments number
article.updateCommentsNumber = function () {
	article.commentsNumber.html ( article.commentsBox.find ( 'div.comment' ).length );
};

// add zero
article.addZero = function ( val ) {
	return ( val < 10 ) ? ( '0' + val ) : val;
};


// init
article.init = function () {

	// captcha init
	captcha.init ( $( '#captcha_update_url' ).val(), $( '#captcha_pic_path' ).val() );


	// leave comment for comment
	article.commentsBox.on ( 'click', 'input.leave-comment', function () {
		var form = $( this ).closest ( 'form' );
		var id = form.find ( 'input[name="id_comment"]' ).val();
		article.showCommentForm ( 'comment', id, form );
		return false;
	});

	// leave comment for article
	article.leaveCommentForArticleLink.click ( function () {
		article.showCommentForm ( 'article', article.mainIdArticle, $( this ).closest ( 'div.text' ) );
		return false;
	});

	// add ajax handler: leave comment
	zForm.addAjaxHandler ({

		// form selector
		_selector: '#leave_comment_form', // optional

		// action before sending a response
		_before: function () { // optional
			loader.show ( 'add_comment' );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			loader.hide ( 'add_comment' );
		},

		// results
		ok: function () {
			article.buildComment();
			article.hideCommentForm();
		}
	});



	// add ajax handler: delete article
	zForm.addAjaxHandler ({

		// form selector
		_selector: '#delete_article_form', // optional

		// action before sending a response
		_before: function () { // optional
			loader.show ( 'delete_article' );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			loader.hide ( 'delete_article' );
		},

		// results
		ok: function () {
			var articleId = zForm.currentAjaxForm.find ( 'input[name="id_article"]' ).val();
			$( '#article_' + articleId ).remove();
			popup.show ( msg.articleHasBeenDeleted );
		}
	});

	// add ajax handler: delete comment
	zForm.addAjaxHandler ({

		// form selector
		_selector: 'form.delete-comment-form', // optional

		// action before sending a response
		_before: function () { // optional
			article.hideCommentForm();
			var commentId = article.getCommentId();
			loader.show ( 'delete_comment_' + commentId );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			var commentId = article.getCommentId();
			loader.hide ( 'delete_comment_' + commentId );
		},

		// results
		ok: function () {
			var commentId = article.getCommentId();
			var commentBox = $( '#comment_' + commentId );
			var commentDepth = parseInt ( commentBox.css ( 'margin-left' ) );
			commentBox.nextAll ( 'div.comment' ).each ( function () {
				var nextCommentDepth = parseInt ( $(this).css ( 'margin-left' ) );
				if ( nextCommentDepth > commentDepth ) {
					$(this).remove();
				} else {
					return false;
				}
			});
			commentBox.remove();
			article.updateCommentsNumber();
		}
	});

};


// autorun
if ( article.commentFormBox.length > 0 ) {
	article.init();
}