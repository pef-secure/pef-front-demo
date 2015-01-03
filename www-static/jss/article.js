
// article

var article = {};


// elements
article.mainIdArticleFld = $( '#main_id_article' );
if ( article.mainIdArticleFld.length > 0 ) {
	article.mainIdArticle = article.mainIdArticleFld.val();
}

article.leaveCommentForArticleLink = $( '#leave_comment_for_article' );

article.commentsBox = $( '#comments' );
article.commentFormBox = $( '#comment_form_box' );
article.commentForm = {};
article.commentForm.form = $( '#comment_form' );
article.commentForm.author = $( '#author' );
article.commentForm.idArticle = $( '#id_article' );
article.commentForm.idCommentParent = $( '#id_comment_parent' );
article.commentForm.captchaHash = $( '#captcha_hash' );
article.commentForm.comment = $( '#comment' );
article.commentForm.captcha = $( '#captcha' );


// check comment form
article.checkCommentForm = function () {
	var errors = '';

	if ( article.commentForm.comment.val() == '' ) {
		errors += msg.fieldIsEmpty.replace ( '[% field_name %]', msg.comment );
	}
	if ( article.commentForm.captcha.val() == '' ) {
		errors += msg.fieldIsEmpty.replace ( '[% field_name %]', msg.captcha );
	}

	return errors;
};

// send comment form
article.sendCommentForm = function () {
	var query = 'comment=' + article.commentForm.comment.val() + 
				'&captcha_code=' + article.commentForm.captchaCode.val() + 
				'&captcha_hash=' + article.commentForm.captchaHash.val() + 
				'&author=' + article.commentForm.author.val();
	if ( article.commentForm.idArticle.val() != '' ) {
		query += '&id_article=' + article.commentForm.idArticle.val();
	}
	if ( article.commentForm.idCommentParent.val() != '' ) {
		query += '&id_comment_parent=' + article.commentForm.idCommentParent.val();
	}

	$.ajax({
		type: 'POST',
		url: article.commentForm.form.attr ( 'action' ),
		data: query,
		success: function ( response ) {
			loader.hide ( 'add_comment' );
			response = JSON.parse ( response );
			switch ( response.result ) {
				case 'OK':
					article.buildComment ( response.id_comment );
					article.hideCommentForm();
					break;
				default:
					popup.show ( response.result + ': ' + response.answer );
			}
		}
	});
};


// show comment form
article.showCommentForm = function ( commentFor, id ) {
	var clickedLink = null;

	if ( commentFor == 'comment' ) {
		article.commentForm.idArticle.val ( '' );
		article.commentForm.idCommentParent.val ( id );
		clickedLink = $( '#leave_comment_' + id );
	}
	if ( commentFor == 'article' ) {
		article.commentForm.idCommentParent.val ( '' );
		article.commentForm.idArticle.val ( id );
		clickedLink = article.leaveCommentForArticleLink;
	}

	article.commentForm.comment.val ( '' );
	article.commentForm.captchaCode.val ( '' );

	article.commentFormBox.insertAfter ( clickedLink.parent() );
	article.commentFormBox.removeClass ( 'hidden' );
	article.commentForm.comment.focus();
};

// hide comment form
article.hideCommentForm = function ( commentFor, id ) {
	article.commentFormBox.addClass ( 'hidden' );
};


// build comment
article.buildComment = function ( commentId, depth ) {
	var depthPx = depth * 10;
	var commentBox = $( '<div></div>' );
	commentBox.attr ( 'id', 'comment_' + commentId );
	commentBox.attr ( 'class', 'comment' );
	commentBox.css ( 'margin-left', depthPx + 'px' );
	commentBox.html ( '<p>' + article.commentForm.comment.val() + '</p>' + 
					  '<p class="comment-answer-link"><a href="#" class="leave-comment" id="leave_comment_' + commentId + '">leave a comment</a> | <a href="#" class="delete-comment" id="delete_comment_' + commentId + '">delete comment</a></p>');

	if ( article.commentForm.idArticle.val () == '' ) {
		var insertAfterComment = $( '#comment_' + article.commentForm.idCommentParent.val() );
		commentBox.insertAfter ( insertAfterComment );
	} else {
		article.commentsBox.append ( commentBox );
	}
};


// delete article
article.deleteArticle = function ( articleId ) {
	$.ajax({
		type: 'POST',
		url: '/ajaxDelArticle',
		data: 'id_article=' + articleId,
		success: function ( response ) {
			loader.hide ( 'add_comment' );
			response = JSON.parse ( response );
			switch ( response.result ) {
				case 'OK':
					$( '#article_' + articleId ).remove();
					popup.show ( msg.articleHasBeenDeleted );
					break;
				default:
					popup.show ( response.result + ': ' + response.answer );
			}
		}
	});
};

// delete comment
article.deleteComment = function ( commentId ) {
	$.ajax({
		type: 'POST',
		url: '/ajaxDelCommentWithTree',
		data: 'id_comment=' + commentId,
		success: function ( response ) {
			loader.hide ( 'add_comment' );
			response = JSON.parse ( response );
			switch ( response.result ) {
				case 'OK':
					$( '#comment_' + commentId ).remove();
					// TODO: дописать удаление всех комментариев, который были ответом на удаленный
					// TODO: дописать изменение количества комментариев в заголовке
					break;
				default:
					popup.show ( response.result + ': ' + response.answer );
			}
		}
	});
};


// init
article.init = function () {

	// leave comment for comment
	article.commentsBox.on ( 'click', 'a.leave-comment', function () {
		var id = $( this ).attr ( 'id' ).replace ( 'leave_comment_', '' );
		article.showCommentForm ( 'comment', id );
		return false;
	});

	// leave comment for article
	article.leaveCommentForArticleLink.click ( function () {
		article.showCommentForm ( 'article', article.mainIdArticle );
		return false;
	});


	// send btn click
	$( '#add_comment_btn' ).click ( function () {
		loader.show ( 'add_comment' );
	});

	// comment form sumit
	article.commentForm.form.submit ( function () {
		var errors = article.checkCommentForm();
		if ( errors == '' ) {
			article.sendCommentForm();
		} else {
			loader.hide ( 'add_comment' );
			popup.show ( errors );
		}
		return false;
	});


	// delete article btn click
	$( '#delete_article_send_btn' ).click ( function () {
		loader.show ( 'delete_article' );
		article.deleteArticle ( article.mainIdArticle );
	});

	// delete comment btn click
	article.commentsBox.on ( 'click', 'a.delete-comment', function () {
		var id = $( this ).attr ( 'id' ).replace ( 'delete_comment_', '' );
		article.deleteComment ( id );
		return false;
	});

};


// autorun
if ( article.commentFormBox.length > 0 ) {
	article.init();
}