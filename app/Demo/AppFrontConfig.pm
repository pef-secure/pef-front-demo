package Demo::AppFrontConfig;

our @EXPORT = qw{
  demo_login_expires
};

# user params
sub demo_login_expires { '30 days' }

# PEF::Front params
sub cfg_db_user      { "pef" }
sub cfg_db_password  { "" }
sub cfg_db_name      { "pef" }
sub cfg_captcha_font { "/usr/share/fonts/truetype/ttf-dejavu/DejaVuSansMono-Bold.ttf" }

1;
