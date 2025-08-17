-- Author
create table IF NOT EXISTS Author(
    author_id int auto_increment primary key,
    name varchar(100) not null
);

-- Publisher
create table IF NOT EXISTS Publisher(
    publisher_id int auto_increment primary key,
    name varchar(100) not null
);

-- Category
create table IF NOT EXISTS Category(
    category_id int auto_increment primary key,
    name varchar(100) not null
);

-- Book
create table IF NOT EXISTS Book(
    book_id int auto_increment primary key,
    name varchar(100) not null,
    description varchar(500) not null,
    publication_date date not null,
    purchase_price decimal(10,2) not null,
    author_id int,
    publisher_id int,
    category_id int,
    foreign key (author_id) references Author(author_id),
    foreign key (publisher_id) references Publisher(publisher_id),
    foreign key (category_id) references Category(category_id)
);