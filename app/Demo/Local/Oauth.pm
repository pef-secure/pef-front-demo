package Demo::Local::Oauth;
use PEF::Front::Config;
use PEF::Front::Oauth;
use PEF::Front::Session;
use strict;
use warnings;

sub make_url {
	my ($req, $defaults) = @_;
	my $session = PEF::Front::Session->new($req);
	my $oauth   = PEF::Front::Oauth->new($req->{cookie}, $session);
	my $expires = demo_login_expires();
	$session->data->{oauth_return_url} = $defaults->{headers}->get_header('Referer') || '/';
	return {
		result  => "OK",
		url     => $oauth->authorization_server($oauth->user_info_scope),
		auth    => $session->key,
		expires => $expires,
		service => $req->{cookie},
	};
}

sub callback {
	my ($req, $defaults) = @_;
	my $session = PEF::Front::Session->new($req);
	my $back_url = $session->data->{oauth_return_url} || '/';
	delete $session->data->{oauth_return_url};
	unless ($req->{state} && $req->{code}) {
		delete $session->data->{oauth_state};
		return {
			result => "OAUTHERR",
			answer => $req->{error_description}
		};
	}
	my $service = $session->data->{oauth_state}{$req->{state}};
	return {
		result => "OAUTHERR",
		answer => 'Unknoen oauth state'
	} unless $service;
	my $oauth = PEF::Front::Oauth->new($service, $session);
	$oauth->exchange_code_to_token($req);
	my $info = $oauth->get_user_info();
	$session->data->{name} = $info->{name};
	$session->data->{is_author} ||= 0;
	return {
		result   => "OK",
		back_url => $back_url,
		%$info
	};
}

1;
