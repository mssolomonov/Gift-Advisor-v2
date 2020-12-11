create table usertable
(
    id       serial    not null
        constraint usertable_pk
            primary key,
    username char(256) not null,
    hash     char(256) not null
);


create table tags
(
    id   serial not null
        constraint tags_pk
            primary key,
    name char(256)
);


create table gifts
(
    id          serial    not null
        constraint gifts_pk
            primary key,
    name        char(256) not null,
    image_url   char(256),
    description char(1024),
    id_user     integer
        constraint gifts_usertable_id_fk
            references usertable,
    price       double precision default 0
);

create table popularity
(
    id      serial  not null
        constraint popularity_pk
            primary key,
    gift_id integer not null
        constraint popularity_gifts_id_fk
            references gifts,
    count   integer default 0
);


create table gifts_tags
(
    id      serial  not null
        constraint gifts_tags_pk
            primary key,
    id_gift integer not null
        constraint gifts_tags_gifts_id_fk
            references gifts,
    id_tag  integer not null
        constraint gifts_tags_tags_id_fk
            references tags
);

insert into gifts(name) values ('example')