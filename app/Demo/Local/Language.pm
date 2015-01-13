package Demo::Local::Language;
use PEF::Front::Config;
use DBIx::Struct qw(hash_ref_slice);

sub get_langs {
	my ($req, $defaults) = @_;
	return {
		result => "OK",
		langs  => all_rows(
			[nls_lang => -columns => ['short lang', 'name language']],
			{-bool    => 'is_active'},
			sub { $_->data }
		)
	};
}

sub set_lang {
	my ($req, $defaults) = @_;
	my $lang = one_row(nls_lang => {short => $req->{lang}, -bool => 'is_active'});
	my $short;
	if ($lang) {
		$short = $lang->short;
	} else {
		$short = cfg_default_lang;
	}
	return {
		result => "OK",
		lang   => $short
	};
}

1;
