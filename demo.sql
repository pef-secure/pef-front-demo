create table author (
    id_author     serial   primary key,
    name          text     not null unique,
    login         text     not null unique,
    password      text     not null,
    constraint c_password check(length (password) > 4)
);

create table author_auth (
    auth          text      not null unique,
    expires       timestamp not null default now() + interval '30 days',
    id_author     integer   not null references author(id_author) on delete cascade
);

create table article (
    id_article    serial    primary key,
    title         text      not null,
    content       text      not null,
    pub_date      timestamp not null default now(),
    id_author     integer   not null references author(id_author) on delete cascade
);

create table comment (
    id_comment         serial    primary key,
    id_comment_parent  integer,
    id_article         integer   not null references article(id_article) on delete cascade,
    pub_date           timestamp not null default now(),
    comment            text      not null,
    author             text      not null
);

alter table comment add constraint fk_comment_parent 
  foreign key (id_comment_parent) references comment(id_comment) on delete cascade;

create index i_comment_id_article on comment (id_article);
create index i_comment_id_parent on comment (id_comment_parent);
create index i_author_auth_id_author on author_auth (id_author);
create index i_author_password on author (password);
create index i_article_id_author on article (id_author);
