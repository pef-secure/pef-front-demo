package Demo::InFilter::Auth;
use DBIx::Struct;
use Demo::Common;

sub required {
	my ($field, $def) = @_;
	my $author = get_author_from_auth($field);
	die {
		result => "NEED_LOGIN",
		answer => 'You have to login for this operation'
	  }
	  unless $author;
	$field;
}

1;
