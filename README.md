PEF::Front Demo App
==============

Used Debian 7 packages:
* nginx
* uwsgi
* uwsgi-core
* uwsgi-plugin-psgi
* libdevel-stacktrace-perl
* libgd-securityimage-perl
* libdbix-connector-perl
* libcache-fastmmap-perl
* libgeo-ipfree-perl
* libjson-perl
* libmldbm-sync-perl
* libregexp-common-perl
* libtemplate-alloy-perl
* libtime-duration-parse-perl
* liburi-encode-perl
* libxml-simple-perl
* libyaml-libyaml-perl
* libsql-abstract-perl

Used framework repositories:
* https://github.com/pef-secure/dbix-struct.git
* https://github.com/pef-secure/pef-front-psgi-dist.git

PostgreSQL setup:
* su - postgres
* createdb pef
* createuser pef
* ^D
* su - pef
* psql < nls.sql
* psql < demo.sql

Nginx setup:
* vi /etc/nginx/nginx.conf
* /include
* add string include /home/pef/pef-front-demo/conf/nginx-handlers.conf;

Uwsgi setup:
* cd /etc/uwsgi/apps-enabled
* ln -s /home/pef/pef-front-demo/conf/demoapp.ini .

