CREATE DATABASE IF NOT EXISTS eco_books;
USE eco_books;

-- Cart
create table IF NOT EXISTS Cart(
    cart_id int auto_increment primary key,
    total decimal(10,2) not null,
    user_id int,
    foreign key (user_id) references User(user_id)
);

-- Inventory
create table IF NOT EXISTS Inventory(
    inventory_id int auto_increment primary key,
    quantity int not null,
    location varchar(100) not null,
    book_id int,
    foreign key (book_id) references Book(book_id)
);