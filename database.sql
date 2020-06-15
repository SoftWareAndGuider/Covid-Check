-- create user 'covidcheck'@localhost identified by 'covidcheck1234';

create schema if not exists covidcheck_bdnms;
use covidcheck_bdnms;
grant all privileges on covidcheck_bdnms.* to 'covidcheck'@localhost;

create table if not exists checks
(
    id      int                  not null,
    name    varchar(15)          not null,
    grade   int                  not null,
    class   int                  not null,
    number  int                  not null,
    checked tinyint(1) default 0 not null,
    constraint checks_id_uindex
        unique (id)
);

alter table checks
    add primary key (id);

create table if not exists saves
(
    savedAt  timestamp default current_timestamp() not null,
    filename char(100)                             null,
    constraint saves_savedAt_uindex
        unique (savedAt)
);

alter table saves
    add primary key (savedAt);
