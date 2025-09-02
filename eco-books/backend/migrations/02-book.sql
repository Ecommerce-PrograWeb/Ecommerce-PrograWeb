CREATE DATABASE IF NOT EXISTS eco_books;
USE eco_books;

-- Author
create table IF NOT EXISTS Author(
    author_id int auto_increment primary key,
    name varchar(100) not null,
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

-- Publisher
create table IF NOT EXISTS Publisher(
    publisher_id int auto_increment primary key,
    name varchar(100) not null,
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

-- Category
create table IF NOT EXISTS Category(
    category_id int auto_increment primary key,
    name varchar(100) not null,
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
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
    foreign key (category_id) references Category(category_id),
    created_date datetime not null default current_timestamp,
    updated_date datetime null on update current_timestamp,
    deleted_date datetime  null,
    created_by int,
    Foreign key (created_by) references User(user_id)
);

/*

-- Rollback (drop all four tables)
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Book`;
DROP TABLE IF EXISTS `Category`;
DROP TABLE IF EXISTS `Publisher`;
DROP TABLE IF EXISTS `Author`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just Book table
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Book`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just Author table
USE eco_books;

-- Remove FK from `Book` -> `Author` first (auto-detect name)
SELECT CONSTRAINT_NAME INTO @fk_book_author
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'eco_books'
  AND TABLE_NAME = 'Book'
  AND COLUMN_NAME = 'author_id'
  AND REFERENCED_TABLE_NAME = 'Author'
LIMIT 1;

SET @sql := IF(@fk_book_author IS NOT NULL,
  CONCAT('ALTER TABLE `Book` DROP FOREIGN KEY `', @fk_book_author, '`'),
  'SELECT 1');

PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `Author`;

-- Drop just Publisher table
USE eco_books;

-- Remove FK from `Book` -> `Publisher` first (auto-detect name)
SELECT CONSTRAINT_NAME INTO @fk_book_publisher
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'eco_books'
  AND TABLE_NAME = 'Book'
  AND COLUMN_NAME = 'publisher_id'
  AND REFERENCED_TABLE_NAME = 'Publisher'
LIMIT 1;

SET @sql := IF(@fk_book_publisher IS NOT NULL,
  CONCAT('ALTER TABLE `Book` DROP FOREIGN KEY `', @fk_book_publisher, '`'),
  'SELECT 1');

PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `Publisher`;

-- Drop just Category table
USE eco_books;

-- Remove FK from `Book` -> `Category` first (auto-detect name)
SELECT CONSTRAINT_NAME INTO @fk_book_category
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'eco_books'
  AND TABLE_NAME = 'Book'
  AND COLUMN_NAME = 'category_id'
  AND REFERENCED_TABLE_NAME = 'Category'
LIMIT 1;

SET @sql := IF(@fk_book_category IS NOT NULL,
  CONCAT('ALTER TABLE `Book` DROP FOREIGN KEY `', @fk_book_category, '`'),
  'SELECT 1');

PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `Category`;

*/