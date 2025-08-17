-- Address
create table IF NOT EXISTS Address(
    address_id int auto_increment primary key,
    city varchar(100) not null,
    zone varchar(100) not null,
    name varchar(100)
);

-- OrderDetail
create table IF NOT EXISTS OrderDetail(
    order_detail_id int auto_increment primary key,
    sale_price decimal(10,2) not null,
    book_id int,
    foreign key (book_id) references Book(book_id)
);

-- Order
create table IF NOT EXISTS Order(
    order_id int auto_increment primary key,
    date date not null,
    status varchar(100) not null 
        check(status in ('Pending', 'Delivered')),
    user_id int,
    order_detail_id int,
    address_id int,
    cart_id int,
    foreign key (user_id) references User(user_id),
    foreign key (order_detail_id) references OrderDetail(order_detail_id),
    foreign key (address_id) references Address(address_id),
    foreign key (cart_id) references Cart(cart_id)
);