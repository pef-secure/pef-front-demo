create table language (
    short_lang   char(2)   primary key,
    alt_lang     char(2)   default 'en'
);

create table geo_language (
    country      char(2)   primary key,
    short_lang   char(2)   references language(short_lang)
);

create table nls_msgid (
    id_nls_msgid     serial       primary key,
    msgid            text         not null unique
);

create table nls_message (
    id_nls_msgid     integer     references nls_msgid(id_nls_msgid),
    short_lang       char(2)     references language(short_lang) not null,
    message          text        not null,
    unique (id_nls_msgid, short_lang)
);

create index i_geo_language_short_lang on geo_language (short_lang);
create index i_nls_message_short_lang on nls_message (short_lang);
create index i_nls_message_id_nls_msgid on nls_message (id_nls_msgid);
