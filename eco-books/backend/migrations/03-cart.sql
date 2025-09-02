USE eco_books;

-- Cart
create table IF NOT EXISTS Cart(
    cart_id int auto_increment primary key,
    total decimal(10,2) not null,
    user_id int,
    foreign key (user_id) references User(user_id),
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

-- Inventory
create table IF NOT EXISTS Inventory(
    inventory_id int auto_increment primary key,
    quantity int not null,
    location varchar(100) not null,
    book_id int,
    foreign key (book_id) references Book(book_id),
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

/*

-- Rollback (drop both tables)
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Cart`;
DROP TABLE IF EXISTS `Inventory`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just Cart table
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Cart`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just Inventory table
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Inventory`;
SET FOREIGN_KEY_CHECKS = 1;

*/