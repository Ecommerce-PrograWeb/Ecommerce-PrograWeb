USE eco_books;

-- Roles
INSERT INTO Role (type) VALUES ('Customer');
INSERT INTO Role (type) VALUES ('Admin');

-- Authors
INSERT INTO Author (name) VALUES ('Miguel de Cervantes');
INSERT INTO Author (name) VALUES ('Gabriel Garcia Marquez');
INSERT INTO Author (name) VALUES ('Rebecca Yarros');
INSERT INTO Author (name) VALUES ('Mel Robbins');
INSERT INTO Author (name) VALUES ('Suzanne Collins');
INSERT INTO Author (name) VALUES ('J.K. Rowling');
INSERT INTO Author (name) VALUES ('Stephen King');
INSERT INTO Author (name) VALUES ('Agatha Christie');
INSERT INTO Author (name) VALUES ('George R.R. Martin');
INSERT INTO Author (name) VALUES ('Paulo Coelho');
INSERT INTO Author (name) VALUES ('Dan Brown');
INSERT INTO Author (name) VALUES ('Gillian Flynn');
INSERT INTO Author (name) VALUES ('John Green');
INSERT INTO Author (name) VALUES ('Margaret Atwood');
INSERT INTO Author (name) VALUES ('Isaac Asimov');

-- Publishers  
INSERT INTO Publisher (name) VALUES ('Editorial Ejemplo');
INSERT INTO Publisher (name) VALUES ('Penguin Random House');
INSERT INTO Publisher (name) VALUES ('HarperCollins');
INSERT INTO Publisher (name) VALUES ('Bloomsbury');
INSERT INTO Publisher (name) VALUES ('Scribner');
INSERT INTO Publisher (name) VALUES ('Crown Publishing');
INSERT INTO Publisher (name) VALUES ('Bantam Doubleday Dell');

-- Categories
INSERT INTO Category (name) VALUES ('Acción');
INSERT INTO Category (name) VALUES ('Aventura');
INSERT INTO Category (name) VALUES ('Romance');
INSERT INTO Category (name) VALUES ('Fantasía');
INSERT INTO Category (name) VALUES ('Novela');
INSERT INTO Category (name) VALUES ('Suspenso');
INSERT INTO Category (name) VALUES ('Terror');
INSERT INTO Category (name) VALUES ('Misterio');
INSERT INTO Category (name) VALUES ('Ciencia Ficción');
INSERT INTO Category (name) VALUES ('Autoayuda');
INSERT INTO Category (name) VALUES ('Thriller');
INSERT INTO Category (name) VALUES ('Drama');
INSERT INTO Category (name) VALUES ('Histórica');

-- Address
INSERT INTO Address (city, zone, name) VALUES ('Madrid', 'Centro', 'Casa Juan');
INSERT INTO Address (city, zone, name) VALUES ('Bogota', 'Norte', 'Casa Admin');

-- Insert data into Book
INSERT INTO Book (name, cover, description, publication_date, purchase_price, author_id, publisher_id, category_id)
VALUES 
-- Action (category_id: 1)
('Onyx Storm', 'Onyx Storm.jpg', 'Una épica de acción y romance que continúa la saga de Violet Sorrengail', '2025-01-01', 199.99, 3, 2, 1),
('Game of Thrones', 'game-of-thrones.jpg', 'El primer libro de la saga Canción de Hielo y Fuego', '1996-08-01', 299.99, 9, 6, 1),

-- Adventure (category_id: 2)  
('Harry Potter y la Piedra Filosofal', 'harry-potter-1.jpg', 'El inicio de las aventuras del joven mago Harry Potter', '1997-06-26', 179.99, 6, 4, 2),
('El Código Da Vinci', 'da-vinci-code.jpg', 'Un thriller de aventuras lleno de misterios históricos', '2003-03-18', 249.99, 11, 6, 2),

-- Romance (category_id: 3)
('The Let Them Theory', 'The Let Them Theory.jpg', 'Una guía motivacional sobre relaciones y amor propio', '2025-02-01', 234.99, 4, 3, 3),
('Bajo la Misma Estrella', 'bajo-la-misma-estrella.jpg', 'Una hermosa historia de amor entre dos adolescentes', '2012-01-10', 189.99, 13, 2, 3),

-- Fantasy (category_id: 4)
('Sunrise on the Reaping', 'Sunrise on the Reaping.jpg', 'Una precuela de Los Juegos del Hambre ambientada 64 años antes', '2025-03-01', 199.99, 5, 2, 4),
('El Alquimista', 'el-alquimista.jpg', 'Una fábula sobre seguir los sueños y encontrar el destino', '1988-01-01', 159.99, 10, 2, 4),

-- Horror (category_id: 7)
('IT (Eso)', 'it-stephen-king.jpg', 'La terrorífica historia del payaso Pennywise', '1986-09-15', 279.99, 7, 5, 7),
('El Resplandor', 'el-resplandor.jpg', 'Un clásico del terror psicológico en el Hotel Overlook', '1977-01-28', 259.99, 7, 5, 7),

-- Mistery (category_id: 8)
('Asesinato en el Orient Express', 'orient-express.jpg', 'El famoso detective Hercule Poirot resuelve un crimen en el tren', '1934-01-01', 169.99, 8, 3, 8),
('Perdida', 'perdida-gone-girl.jpg', 'Un thriller psicológico sobre la desaparición de Amy Dunne', '2012-06-05', 219.99, 12, 6, 8),

-- Cience Fiction (category_id: 9)
('Fundación', 'fundacion-asimov.jpg', 'La primera novela de la famosa saga de Isaac Asimov', '1951-05-01', 199.99, 15, 6, 9),
('El Cuento de la Criada', 'cuento-criada.jpg', 'Una distopía sobre un futuro totalitario', '1985-08-17', 209.99, 14, 7, 9),

-- Self-help (category_id: 10)
('Los 7 Hábitos de la Gente Altamente Efectiva', '7-habitos.jpg', 'Guía para el desarrollo personal y profesional', '1989-08-15', 199.99, 4, 2, 10),

-- Thriller (category_id: 11)
('El Silencio de los Corderos', 'silencio-corderos.jpg', 'Thriller psicológico con Hannibal Lecter', '1988-10-01', 229.99, 7, 5, 11),

-- Historical (category_id: 13)
('Cien Años de Soledad', 'cien-anos-soledad.jpg', 'Obra maestra del realismo mágico', '1967-06-05', 189.99, 2, 1, 13),
('Don Quijote de la Mancha', 'don-quijote.jpg', 'La obra cumbre de la literatura española', '1605-01-16', 299.99, 1, 1, 13);

-- OrderDetails
/*
INSERT INTO OrderDetail (sale_price, book_id) VALUES (99.99, 1);
INSERT INTO OrderDetail (sale_price, book_id) VALUES (79.99, 2);
*/