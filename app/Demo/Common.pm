package Demo::Common;
use DBIx::Struct;
use base 'Exporter';
our @EXPORT = qw{
  get_author_from_auth
};

sub get_author_from_auth {
	my $auth = $_[0];
	DBC::AuthorAuth->delete({expires => {'<', \"now()"}});
	my $author_auth = one_row(author_auth => {auth => $auth});
	return if not $author_auth;
	$author_auth->Author;
}

1;
