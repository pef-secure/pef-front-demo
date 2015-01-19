package Demo::Local::Article;
use DBIx::Struct qw(connector hash_ref_slice);
use Demo::Common;
use PEF::Front::NLS;

sub get_articles {
	my ($req, $defaults) = @_;
	my $articles = all_rows(
		[   "article a" => -join => "author w",
			-columns => ['a.*', 'w.name author']
		],
		-order_by => {-desc => 'id_article'},
		-limit    => $req->{limit},
		-offset   => $req->{offset},
		sub { $_->filter_timestamp->data }
	);
	for my $article (@$articles) {
		$article->{comment_count} =
		  one_row([comment => -columns => 'count(*)'], {hash_ref_slice $article, 'id_article'})->count;
	}
	return {
		result   => "OK",
		articles => $articles,
		count    => one_row([article => -columns => 'count(*)'])->count
	};
}

sub get_article_with_comments {
	my ($req, $defaults) = @_;
	my $article = one_row(article => $req->{id_article});
	return {
		result => "NO_ARTICLE",
		answer => "No such article"
	} unless $article;
	# transform object into hash
	my $article_hash = $article->filter_timestamp->data;
	$article_hash->{author} = $article->Author->name;
	return {
		result   => "OK",
		article  => $article_hash,
		comments => connector->run(
			sub {
				$_->selectall_arrayref(
					q{
						with recursive article_comments(depth, path) as (
							select 1 depth, array[id_comment] path, id_comment, 
								id_comment_parent, comment, author,
								date_trunc('seconds', pub_date) pub_date
							from comment
							where id_article = ? and id_comment_parent is null
							union all
							select depth + 1, path || array[c.id_comment] path, c.id_comment, 
								c.id_comment_parent, c.comment, c.author,
								date_trunc('seconds', c.pub_date) pub_date
							from comment c, article_comments cs
							where c.id_comment_parent = cs.id_comment
						) select * from article_comments order by path, id_comment
					},
					{Slice => {}},
					$req->{id_article}
				);
			}
		)
	};
}

sub add_comment {
	my ($req, $defaults) = @_;
	my $session = PEF::Front::Session->new($req);
	my @cookies;
	unless (%{$session->data}) {
		return {
			result => "NO_CAPTCHA",
			answer => "Anonymous user must enter CAPTCHA"
		  }
		  if $req->{captcha_code} eq 'nocheck';
		$session->data(
			{   is_author => 0,
				name      => $req->{author},
			}
		);
		@cookies = (
			answer_cookies => [
				auth => {
					value   => $session->key,
					expires => demo_login_expires
				}
			]
		);
	}
	my $new_comment = new_row(
		comment => hash_ref_slice $req,
		qw(id_article id_comment_parent comment author)
	);
	$new_comment->fetch;
	$new_comment->filter_timestamp;
	my $comment_count =
	  one_row([comment => -columns => 'count(*)'], {hash_ref_slice $req, 'id_article'})->count;
	my $path = connector->run(
		sub {
			$_->selectrow_hashref(
				q{
					with recursive comment_path(path) as (
						select array[id_comment] path, id_comment_parent, id_comment 
						from comment
						where id_comment = ?
						union all 
						select array[c.id_comment] || path, c.id_comment_parent, c.id_comment 
						from comment c, comment_path cp 
						where cp.id_comment_parent = c.id_comment
					) 
					select * 
					from comment_path 
					where id_comment_parent is null
				}, undef, $new_comment->id_comment
			);
		}
	);
	return {
		result          => "OK",
		id_comment      => $new_comment->id_comment,
		path            => $path->{path},
		pub_date        => $new_comment->pub_date,
		comments_number => msg_get_n($defaults->{lang}, '$1 comments', $comment_count, $comment_count)->{message},
		@cookies
	};
}

sub delete_article_with_comments {
	my ($req, $defaults) = @_;
	DBC::Article->delete({hash_ref_slice $req, 'id_article'});
	return {result => "OK"};
}

sub delete_comment_with_tree {
	my ($req, $defaults) = @_;
	my $comment = one_row(comment => $req->{id_comment});
	return {
		result => "NO_COMMENT",
		answer => 'No such comment'
	  }
	  unless $comment;
	DBC::Comment->delete({hash_ref_slice $req, 'id_comment'});
	my $comment_count =
	  one_row([comment => -columns => 'count(*)'], {id_article => $comment->id_article})->count;
	return {
		result          => "OK",
		comments_number => msg_get_n($defaults->{lang}, '$1 comments', $comment_count, $comment_count)->{message}
	};
}

sub add_article {
	my ($req, $defaults) = @_;
	my $author = get_author_from_auth($req->{auth});
	$req->{id_author} = $author->id_author;
	return {
		result     => "OK",
		id_article => new_row(
			article => hash_ref_slice $req,
			qw(title content id_author)
		)->id_article
	};
}

sub edit_article {
	my ($req, $defaults) = @_;
	my $article = one_row(article => $req->{id_article});
	return {
		result => "NO_ARTICLE",
		answer => "No such article"
	} unless $article;
	$article->title($req->{title});
	$article->content($req->{content});
	$article->update;
	my $author       = $article->Author->name;
	my $article_hash = $article->filter_timestamp->data;
	$article_hash->{author} = $author;
	return {
		result  => "OK",
		article => $article_hash,
	};
}

1;
