USE eco_books;

-- Roles
INSERT INTO Role (type) VALUES ('Customer');
INSERT INTO Role (type) VALUES ('Admin');

-- Authors
INSERT INTO Author (name) VALUES ('Miguel de Cervantes');
INSERT INTO Author (name) VALUES ('Gabriel Garcia Marquez');

-- Publishers
INSERT INTO Publisher (name) VALUES ('Editorial Ejemplo');
INSERT INTO Publisher (name) VALUES ('Penguin Random House');

-- Categories
INSERT INTO Category (name) VALUES ('Novela');
INSERT INTO Category (name) VALUES ('Ficcion');

-- Address
INSERT INTO Address (city, zone, name) VALUES ('Madrid', 'Centro', 'Casa Juan');
INSERT INTO Address (city, zone, name) VALUES ('Bogota', 'Norte', 'Casa Admin');

-- OrderDetails
/*
INSERT INTO OrderDetail (sale_price, book_id) VALUES (99.99, 1);
INSERT INTO OrderDetail (sale_price, book_id) VALUES (79.99, 2);
*/