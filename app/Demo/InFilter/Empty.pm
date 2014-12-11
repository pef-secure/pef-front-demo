package Demo::InFilter::Empty;

sub to_undef {
	my ($field, $def) = @_;
	$field = undef if $field eq '';
	$field;
}

1;