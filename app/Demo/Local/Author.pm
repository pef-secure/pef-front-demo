package Demo::Local::Author;
use PEF::Front::Config;
use DBIx::Struct qw(hash_ref_slice);
use Demo::Common;

sub get_info {
	my ($req, $defaults) = @_;
	my $ret;
	my $session = PEF::Front::Session->new($req);
	if (%{$session->data}) {
		$ret = {
			result => "OK",
			hash_ref_slice $session->data, qw(id_author name login is_author)
		};
	} else {
		$ret = {
			result => "NEED_LOGIN",
			answer => 'You have to login for this operation'
		};
	}
	return $ret;
}

sub login {
	my ($req, $defaults) = @_;
	my $author = one_row(author => {hash_ref_slice $req, qw(login password)});
	if ($author) {
		my $session = PEF::Front::Session->new;
		$session->data(
			{   is_author => 1,
				hash_ref_slice $author->data, qw(id_author name login)
			}
		);
		my $auth    = $session->key;
		my $expires = demo_login_expires;
		new_row(
			'author_auth',
			id_author => $author->id_author,
			auth      => $auth,
			expires   => [\"now() + ?::interval", $expires]
		);
		return {
			result  => "OK",
			expires => $expires,
			auth    => $auth
		};
	}
	return {
		result => "PASSWORD",
		answer => 'Wrong password'
	};
}

sub logout {
	my ($req, $defaults) = @_;
	PEF::Front::Session->new($req)->destroy();
	DBC::AuthorAuth->delete({auth => $req->{auth}});
	return {result => "OK"};
}

1;
