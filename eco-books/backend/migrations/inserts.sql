--Needed for user
INSERT INTO Role (type) VALUES ('Customer'), ('Admin');

--Needed for book
INSERT INTO `Author` (name) VALUES ('Author 1'), ('Author 2');

INSERT INTO `Publisher` (name) VALUES ('Publisher 1'), ('Publisher 2');

INSERT INTO `Category` (name) VALUES ('Category 1'), ('Category 2');

--Needed for order
INSERT INTO `OrderDetail` (sale_price, book_id) VALUES (19.99, 1), (29.99, 2);
INSERT INTO `Address` (city, zone, name) VALUES ('City A', 'Zone A', 'Home'), ('City B', 'Zone B', 'Work');
--also a cart_id

--A user is needed for cart post
