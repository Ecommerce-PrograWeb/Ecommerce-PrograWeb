-- tables

-- author
create table IF NOT EXISTS Author(
    author_id int auto_increment primary key,
    name varchar(100) not null
);

-- publisher
create table IF NOT EXISTS Publisher(
    publisher_id int auto_increment primary key,
    name varchar(100) not null
);

-- category
create table IF NOT EXISTS Category(
    category_id int auto_increment primary key,
    name varchar(100) not null
);

-- book
create table IF NOT EXISTS Book(
    book_id int auto_increment primary key,
    name varchar(100) not null,
    description varchar(500) not null,
    publication_date date not null,
    purchase_price decimal(10,2) not null,
    author_id int,
    publisher_id int,
    category_id int,
    foreign key (author_id) 
        references Author(author_id),
    foreign key (publisher_id) 
        references Publisher(publisher_id),
    foreign key (category_id) 
        references Category(category_id)
);

-- role
create table IF NOT EXISTS Role(
    role_id int auto_increment primary key,
    type varchar(100) not null
        check(type in ('Customer', 'Admin'))
);

-- user
create table IF NOT EXISTS User(
    user_id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) not null,
    password varchar(100) not null,
    role_id int,
    foreign key (role_id) 
        references Role(role_id)
);

-- address
create table IF NOT EXISTS Address(
    address_id int auto_increment primary key,
    city varchar(100) not null,
    zone varchar(100) not null,
    name varchar(100)
);

-- cart
create table IF NOT EXISTS Cart(
    cart_id int auto_increment primary key,
    total decimal(10,2) not null,
    user_id int,
    foreign key (user_id) 
        references User(user_id)
);

-- orderdetail
create table IF NOT EXISTS OrderDetail(
    order_detail_id int auto_increment primary key,
    sale_price decimal(10,2) not null,
    book_id int,
    foreign key (book_id) 
        references Book(book_id)
);

-- order
create table IF NOT EXISTS `Order`(
    order_id int auto_increment primary key,
    date date not null,
    status varchar(100) not null 
        check(status in ('Pending', 'Delivered')),
    user_id int,
    order_detail_id int,
    address_id int,
    cart_id int,
    foreign key (user_id) 
        references User(user_id),
    foreign key (order_detail_id) 
        references OrderDetail(order_detail_id),
    foreign key (address_id) 
        references Address(address_id),
    foreign key (cart_id) 
        references Cart(cart_id)
);

-- payment
create table IF NOT EXISTS Payment(
    payment_id int auto_increment primary key,
    order_id int,
    payment_date date not null,
    amount decimal(10,2) not null,
    payment_method varchar(100) not null
        check(payment_method in ('Cash', 'Card')),
    foreign key (order_id) 
        references `Order`(order_id)
);

-- inventory
create table IF NOT EXISTS Inventory(
    inventory_id int auto_increment primary key,
    quantity int not null,
    location varchar(100) not null,
    book_id int,
    foreign key (book_id) 
        references Book(book_id)
);
