USE eco_books;

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


-- Rollback (drop both tables)
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Role`;
SET FOREIGN_KEY_CHECKS = 1;

-- Drop just User table
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `User`;
SET FOREIGN_KEY_CHECKS = 1;


-- Drop just Role table
USE eco_books;

-- Remove FK from `User` -> `Role` first (auto-detect name)
SELECT CONSTRAINT_NAME INTO @fk_role
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'eco_books'
  AND TABLE_NAME = 'User'
  AND COLUMN_NAME = 'role_id'
  AND REFERENCED_TABLE_NAME = 'Role'
LIMIT 1;

SET @sql := IF(@fk_role IS NOT NULL,
  CONCAT('ALTER TABLE `User` DROP FOREIGN KEY `', @fk_role, '`'),
  'SELECT 1');

PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `Role`;
