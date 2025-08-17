-- Role
create table IF NOT EXISTS Role(
    role_id int auto_increment primary key,
    type varchar(100) not null
        check(type in ('Customer', 'Admin'))
);

-- User
create table IF NOT EXISTS User(
    user_id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) not null,
    password varchar(100) not null,
    role_id int,
    foreign key (role_id) references Role(role_id)
);