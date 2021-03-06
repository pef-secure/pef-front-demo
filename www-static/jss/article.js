
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

article.commentsBox = $( '#comments_box' );
article.commentFormBox = $( '#comment_form_box' );
article.commentForm = {};
article.commentForm.form = $( '#leave_comment_form' );
article.commentForm.author = $( '#author' );
article.commentForm.idArticle = $( '#id_article' );
article.commentForm.idCommentParent = $( '#id_comment_parent' );
article.commentForm.captchaHash = $( '#captcha_hash_1' );
article.commentForm.comment = $( '#comment' );
article.commentForm.captcha = $( '#captcha_1' );

article.commentTemplate = $( '#comment_template_box' ).html();

article.isUserLogged = ( article.commentForm.author.length == 0 );



// add delete comment ajax handler
article.addDeleteCommentAjaxHandler = function ( selector ) {
	zForm.addAjaxHandler ({

		// form selector
		_selector: selector, // optional

		// action before sending a request
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
			var commentId = article.getCommentPathId();
			var commentBox = $( '#' + commentId );
			commentId += '_';
			article.commentsBox.find ( 'div.comment' ).each ( function () {
				if ( $(this).attr ( 'id' ).search ( commentId ) != -1 ) {
					$(this).remove();
				}
			});
			commentBox.remove();
			article.updateCommentsNumber();
		}
	});
};

// get comment id
article.getCommentId = function () {
	return zForm.currentAjaxForm.find ( 'input[name="id_comment"]' ).val();
};

// get comment path id
article.getCommentPathId = function () {
	return zForm.currentAjaxForm.closest ( 'div.comment' ).attr ( 'id' );
};


// show comment form
article.showCommentForm = function ( commentFor, id, insertAfterElem ) {
	if ( ! article.isUserLogged ) {
		article.commentForm.author.val ( '' );
		captcha.reload ( 'captcha_reload_btn_1', false );
	}
	article.commentForm.comment.val ( '' );
	article.commentForm.captcha.val ( '' );

	if ( commentFor == 'comment' ) {
		article.commentForm.idCommentParent.val ( id );
		article.commentFormBox.insertAfter ( insertAfterElem );
	}
	if ( commentFor == 'article' ) {
		article.commentForm.idCommentParent.val ( '' );
		article.commentFormBox.insertBefore ( article.commentsBox );
	}

	article.commentFormBox.removeClass ( 'hidden' );
	if ( article.isUserLogged ) {
		article.commentForm.comment.focus();
	} else {
		article.commentForm.author.focus();
	}
};

// hide comment form
article.hideCommentForm = function ( commentFor, id ) {
	article.commentFormBox.addClass ( 'hidden' );
	article.commentFormBox.insertAfter ( article.commentsBox );
};


// build comment
article.buildComment = function () {
	var commentId = zForm.currentAjaxResponse.id_comment;
	var commentPath = zForm.currentAjaxResponse.path.join ( '_' );
	var parentCommentPath = commentPath.replace ( '_' + commentId, '' );

//	var userName = article.userName || article.commentForm.author.val();
	
	var userName = zForm.currentAjaxResponse.author;
	
	var commentHtml = article.commentTemplate;
	commentHtml = commentHtml.replace ( /__id__/g, commentId );
	commentHtml = commentHtml.replace ( /__path__/g, commentPath );
	commentHtml = commentHtml.replace ( /__author__/, userName );
	commentHtml = commentHtml.replace ( /__date__/, zForm.currentAjaxResponse.pub_date );
	commentHtml = commentHtml.replace ( /__text__/, article.commentForm.comment.val() );

	if ( article.commentForm.idCommentParent.val() != '' ) {
		var insertAfterComment = $( '#comment_' + parentCommentPath );
		var insertAfterCommentDepth = parseInt ( insertAfterComment.css ( 'margin-left' ), 10 ) + article.depthMargin;
		commentHtml = commentHtml.replace ( /__depth__/, insertAfterCommentDepth );
		insertAfterComment.after ( commentHtml );
	} else {
		commentHtml = commentHtml.replace ( /__depth__/, '0' );
		article.commentsBox.append ( commentHtml );
	}

	if ( article.isUserLogged ) {
		article.addDeleteCommentAjaxHandler ( '#comment_' + commentPath + ' form.delete-comment-form' );
	}
};

// update comments number
article.updateCommentsNumber = function () {
	article.commentsNumber.html ( zForm.currentAjaxResponse.comments_number );
};

// add zero
article.addZero = function ( val ) {
	return ( val < 10 ) ? ( '0' + val ) : val;
};


// init
article.init = function () {

	// captcha init
	captcha.init ( $( '#captcha_reload_url' ).val(), $( '#captcha_pic_path' ).val() );


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

		// action before sending a request
		_before: function () { // optional
			loader.show ( 'add_comment' );
		},

		// action after receiving a response
		_preResponse: function () { // optional
			loader.hide ( 'add_comment' );
			if ( ! article.isUserLogged ) {
				captcha.reload ( 'captcha_reload_btn_1', false );
			}
		},

		// results
		ok: function () {
			if(zForm.currentAjaxResponse.need_reload) {
				window.location = '/article/' + zForm.currentAjaxResponse.id_article;
			} else {
				article.buildComment();
				article.hideCommentForm();
				article.updateCommentsNumber();
			}
		}
	});



	// add ajax handler: delete article
	zForm.addAjaxHandler ({

		// form selector
		_selector: '#delete_article_form', // optional

		// action before sending a request
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
	if ( article.isUserLogged ) {
		article.addDeleteCommentAjaxHandler ( 'form.delete-comment-form' );
	}

};


// autorun
if ( article.commentFormBox.length > 0 ) {
	article.init();
}