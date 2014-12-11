package Demo::AppFrontConfig;

our @EXPORT = qw{
	demo_login_expires
};

sub demo_login_expires {'30 days'}

sub cfg_db_user                    {"pef"}
sub cfg_db_password                {""}
sub cfg_db_name                    {"pef"}



1;
