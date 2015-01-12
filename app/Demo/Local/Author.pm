package Demo::Local::Author;
use PEF::Front::Config;
use DBIx::Struct qw(hash_ref_slice);
use Demo::Common;
use Digest::SHA qw(sha1_hex);

sub get_info {
	my ($req, $defaults) = @_;
	my $author = get_author_from_auth($req->{auth});
	return {
		result => "NEED_LOGIN",
		answer => 'You have to login for this operation'
	  }
	  unless $author;
	return {
		result => "OK",
		hash_ref_slice $author->filter_timestamp->data, qw(id_author name login)
	};
}

sub login {
	my ($req, $defaults) = @_;
	my $author = one_row(author => {hash_ref_slice $req, 'password'});
	if ($author) {
		open my $urand, '<', '/dev/urandom' or die "can't open /dev/urandom: $!";
		read ($urand, my $buf, 32);
		close $urand;
		my $auth    = sha1_hex($buf);
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
	my $author = get_author_from_auth($req->{auth});
	if ($author) {
		DBC::AuthorAuth->delete({auth => $req->{auth}});
	}
	return {result => "OK"};
}

1;
