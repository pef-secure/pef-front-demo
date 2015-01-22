package Demo::AppFrontConfig;
use Time::Duration::Parse;
use feature 'state';

our @EXPORT = qw{
  demo_login_expires
};

# user params
sub demo_login_expires { '30 days' }

# PEF::Front params
sub cfg_session_ttl { state $ttl ||= parse_duration(demo_login_expires()); $ttl }

sub cfg_oauth_client_id {
	state $ids = {
		yandex  => '87d188b469ab4fa1807556b757dd43ed',
		git_hub => '9aaa615d2b89dab026a8'
	};
	$ids->{$_[0]};
}

sub cfg_oauth_client_secret {
	state $secrets = {
		yandex  => '8333c9c57f78446cabf8cbc603d82c43',
		git_hub => 'ff1ba0d2ef9482ae38e4aee03ee38400a3e39cfc'
	};
	$secrets->{$_[0]};
}

sub cfg_db_user      { "pef" }
sub cfg_db_password  { "" }
sub cfg_db_name      { "pef" }
sub cfg_captcha_font { "/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono-Bold.ttf" }

1;
