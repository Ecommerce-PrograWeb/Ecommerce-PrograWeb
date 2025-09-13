CREATE DATABASE IF NOT EXISTS eco_books;
USE eco_books;

-- Author
CREATE TABLE IF NOT EXISTS Author (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES User(user_id)
);

-- Publisher
CREATE TABLE IF NOT EXISTS Publisher (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES User(user_id)
);

-- Category
CREATE TABLE IF NOT EXISTS Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES User(user_id)
);

-- Book
CREATE TABLE IF NOT EXISTS Book (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cover varchar(500),
    description VARCHAR(500) NOT NULL,
    publication_date DATE NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    author_id INT,
    publisher_id INT,
    category_id INT,
    FOREIGN KEY (author_id) REFERENCES Author(author_id),
    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id),
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES User(user_id)
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