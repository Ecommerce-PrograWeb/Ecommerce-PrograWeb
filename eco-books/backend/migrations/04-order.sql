USE eco_books;

-- Address
create table IF NOT EXISTS Address(
    address_id int auto_increment primary key,
    city varchar(100) not null,
    zone varchar(100) not null,
    name varchar(100),
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

-- OrderDetail
create table IF NOT EXISTS OrderDetail(
    order_detail_id int auto_increment primary key,
    sale_price decimal(10,2) not null,
    book_id int,
    foreign key (book_id) references Book(book_id),
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

-- Order
create table IF NOT EXISTS `Order`(
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
    foreign key (cart_id) references Cart(cart_id),
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

/*

-- Rollback (drop all three tables)
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS `OrderDetail`;
DROP TABLE IF EXISTS `Address`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just Order table
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Order`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just OrderDetail table
USE eco_books;

-- Remove FK from `Order` -> `OrderDetail` first (auto-detect name)
SELECT CONSTRAINT_NAME INTO @fk_order_detail
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'eco_books'
  AND TABLE_NAME = 'Order'
  AND COLUMN_NAME = 'order_detail_id'
  AND REFERENCED_TABLE_NAME = 'OrderDetail'
LIMIT 1;

SET @sql := IF(@fk_order_detail IS NOT NULL,
  CONCAT('ALTER TABLE `Order` DROP FOREIGN KEY `', @fk_order_detail, '`'),
  'SELECT 1');

PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `OrderDetail`;

-- Drop just Address table
USE eco_books;

-- Remove FK from `Order` -> `Address` first (auto-detect name)
SELECT CONSTRAINT_NAME INTO @fk_address
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'eco_books'
  AND TABLE_NAME = 'Order'
  AND COLUMN_NAME = 'address_id'
  AND REFERENCED_TABLE_NAME = 'Address'
LIMIT 1;

SET @sql := IF(@fk_address IS NOT NULL,
  CONCAT('ALTER TABLE `Order` DROP FOREIGN KEY `', @fk_address, '`'),
  'SELECT 1');

PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `Address`;

*/