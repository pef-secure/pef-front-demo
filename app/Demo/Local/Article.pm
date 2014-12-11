package Demo::Local::Article;
use DBIx::Struct qw($conn hash_ref_slice);
use Demo::Common;

sub get_articles {
	my ($req, $defaults) = @_;
	return {
		result   => "OK",
		articles => all_rows(
			article => -order_by => {-desc => 'id_article'},
			-limit  => $req->{limit},
			-offset => $req->{offset},
			sub { $_->filter_timestamp->data }
		),
		count => one_row('select count(*) from article')->count
	};
}

sub get_article_with_comments {
	my ($req, $defaults) = @_;
	return {
		result   => "OK",
		article  => one_row(article => $req->{id_article})->filter_timestamp->data,
		comments => $conn->run(
			sub {
				$_->selectall_arrayref(
					q{
						with recursive article_comments(depth, path) as (
							select 1, array[id_comment] path, id_comment, 
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
					Slice => {},
					$req->{id_article}
				);
			}
		)
	};
}

sub add_comment {
	my ($req, $defaults) = @_;
	return {
		result     => "OK",
		id_comment => new_row(
			comment => hash_ref_slice $req,
			qw(id_article id_comment_parent comment)
		)->id_comment
	};
}

sub delete_article_with_commets {
	my ($req, $defaults) = @_;
	return {
		result => "NEED_LOGIN",
		answer => 'You have to login for this operation'
	  }
	  if not get_author_from_auth($req->{auth});
	DBC::Article->delete({hash_ref_slice $req, 'id_article'});
	return {result => "OK"};
}

sub add_article {
	my ($req, $defaults) = @_;
	my $author = get_author_from_auth($req->{auth});
	return {
		result => "NEED_LOGIN",
		answer => 'You have to login for this operation'
	  }
	  if not $author;
	$req->{id_author} = $author->id_author;
	return {
		result     => "OK",
		id_article => new_row(
			article => hash_ref_slice $req,
			qw(title content id_author)
		)->id_article
	};
}

1;
