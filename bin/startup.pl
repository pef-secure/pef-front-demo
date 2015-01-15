#!/usr/bin/perl

use lib qw'app /home/pef/pef-front-psgi-dist/lib /home/pef/dbix-struct/lib';

use Demo::AppFrontConfig;
use PEF::Front::Preload;
use DBIx::Struct (
	connector_module => 'PEF::Front::Connector',
	error_class      => 'DBIx::Struct::Error::Hash'
);

DBIx::Struct::connect();

use PEF::Front::Route (
	'/'               => ['/index', 'R'],
	qr'/index(.*)'    => '/appIndex$1',
	qr'/article/(.*)' => '/appArticle/$1',
	'/add'            => '/appAddArticle',
	qr'/edit/(.*)'    => '/appEditArticle/$1'
);

PEF::Front::Route->to_app();
