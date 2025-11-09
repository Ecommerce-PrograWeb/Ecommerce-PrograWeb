'use strict';

module.exports = {
  async up(qi) {
    const now = new Date();

    const [authors] = await qi.sequelize.query('SELECT author_id, name FROM Author');
    const [publishers] = await qi.sequelize.query('SELECT publisher_id, name FROM Publisher');
    const [categories] = await qi.sequelize.query('SELECT category_id, name FROM Category');

    const aId = (n) => authors.find(a => a.name === n)?.author_id;
    const pId = (n) => publishers.find(p => p.name === n)?.publisher_id;
    const cId = (n) => categories.find(c => c.name === n)?.category_id;

    const rows = [
      // Acción
      { name: 'Onyx Storm', cover: 'Onyx Storm.jpg', description: 'Una épica de acción y romance que continúa la saga de Violet Sorrengail', publication_date: '2025-01-01', purchase_price: 199.99, author_id: aId('Rebecca Yarros'), publisher_id: pId('Penguin Random House'), category_id: cId('Acción'), created_date: now },
      { name: 'Game of Thrones', cover: 'game-of-thrones.jpg', description: 'El primer libro de la saga Canción de Hielo y Fuego', publication_date: '1996-08-01', purchase_price: 299.99, author_id: aId('George R.R. Martin'), publisher_id: pId('Bantam Doubleday Dell'), category_id: cId('Acción'), created_date: now },

      // Aventura
      { name: 'Harry Potter y la Piedra Filosofal', cover: 'harry-potter-1.jpg', description: 'El inicio de las aventuras del joven mago Harry Potter', publication_date: '1997-06-26', purchase_price: 179.99, author_id: aId('J.K. Rowling'), publisher_id: pId('Bloomsbury'), category_id: cId('Aventura'), created_date: now },
      { name: 'El Código Da Vinci', cover: 'da-vinci-code.jpg', description: 'Un thriller de aventuras lleno de misterios históricos', publication_date: '2003-03-18', purchase_price: 249.99, author_id: aId('Dan Brown'), publisher_id: pId('Bantam Doubleday Dell'), category_id: cId('Aventura'), created_date: now },

      // Romance
      { name: 'The Let Them Theory', cover: 'The Let Them Theory.jpg', description: 'Una guía motivacional sobre relaciones y amor propio', publication_date: '2025-02-01', purchase_price: 234.99, author_id: aId('Mel Robbins'), publisher_id: pId('HarperCollins'), category_id: cId('Romance'), created_date: now },
      { name: 'Bajo la Misma Estrella', cover: 'bajo-la-misma-estrella.jpg', description: 'Una hermosa historia de amor entre dos adolescentes', publication_date: '2012-01-10', purchase_price: 189.99, author_id: aId('John Green'), publisher_id: pId('Penguin Random House'), category_id: cId('Romance'), created_date: now },

      // Fantasía
      { name: 'Sunrise on the Reaping', cover: 'Sunrise on the Reaping.jpg', description: 'Una precuela de Los Juegos del Hambre ambientada 64 años antes', publication_date: '2025-03-01', purchase_price: 199.99, author_id: aId('Suzanne Collins'), publisher_id: pId('Penguin Random House'), category_id: cId('Fantasía'), created_date: now },
      { name: 'El Alquimista', cover: 'el-alquimista.jpg', description: 'Una fábula sobre seguir los sueños y encontrar el destino', publication_date: '1988-01-01', purchase_price: 159.99, author_id: aId('Paulo Coelho'), publisher_id: pId('Penguin Random House'), category_id: cId('Fantasía'), created_date: now },

      // Terror
      { name: 'IT (Eso)', cover: 'it-stephen-king.jpg', description: 'La terrorífica historia del payaso Pennywise', publication_date: '1986-09-15', purchase_price: 279.99, author_id: aId('Stephen King'), publisher_id: pId('Scribner'), category_id: cId('Terror'), created_date: now },
      { name: 'El Resplandor', cover: 'el-resplandor.jpg', description: 'Un clásico del terror psicológico en el Hotel Overlook', publication_date: '1977-01-28', purchase_price: 259.99, author_id: aId('Stephen King'), publisher_id: pId('Scribner'), category_id: cId('Terror'), created_date: now },

      // Misterio
      { name: 'Asesinato en el Orient Express', cover: 'orient-express.jpg', description: 'El famoso detective Hercule Poirot resuelve un crimen en el tren', publication_date: '1934-01-01', purchase_price: 169.99, author_id: aId('Agatha Christie'), publisher_id: pId('HarperCollins'), category_id: cId('Misterio'), created_date: now },
      { name: 'Perdida', cover: 'perdida-gone-girl.jpg', description: 'Un thriller psicológico sobre la desaparición de Amy Dunne', publication_date: '2012-06-05', purchase_price: 219.99, author_id: aId('Gillian Flynn'), publisher_id: pId('Bantam Doubleday Dell'), category_id: cId('Misterio'), created_date: now },

      // Ciencia Ficción
      { name: 'Fundación', cover: 'fundacion-asimov.jpg', description: 'La primera novela de la famosa saga de Isaac Asimov', publication_date: '1951-05-01', purchase_price: 199.99, author_id: aId('Isaac Asimov'), publisher_id: pId('Bantam Doubleday Dell'), category_id: cId('Ciencia Ficción'), created_date: now },
      { name: 'El Cuento de la Criada', cover: 'cuento-criada.jpg', description: 'Una distopía sobre un futuro totalitario', publication_date: '1985-08-17', purchase_price: 209.99, author_id: aId('Margaret Atwood'), publisher_id: pId('Bantam Doubleday Dell'), category_id: cId('Ciencia Ficción'), created_date: now },

      // Autoayuda
      { name: 'Los 7 Hábitos de la Gente Altamente Efectiva', cover: '7-habitos.jpg', description: 'Guía para el desarrollo personal y profesional', publication_date: '1989-08-15', purchase_price: 199.99, author_id: aId('Mel Robbins'), publisher_id: pId('Penguin Random House'), category_id: cId('Autoayuda'), created_date: now },

      // Thriller
      { name: 'El Silencio de los Corderos', cover: 'silencio-corderos.jpg', description: 'Thriller psicológico con Hannibal Lecter', publication_date: '1988-10-01', purchase_price: 229.99, author_id: aId('Stephen King'), publisher_id: pId('Scribner'), category_id: cId('Thriller'), created_date: now },

      // Histórica
      { name: 'Cien Años de Soledad', cover: 'cien-anos-soledad.jpg', description: 'Obra maestra del realismo mágico', publication_date: '1967-06-05', purchase_price: 189.99, author_id: aId('Gabriel Garcia Marquez'), publisher_id: pId('Editorial Ejemplo'), category_id: cId('Histórica'), created_date: now },
      { name: 'Don Quijote de la Mancha', cover: 'don-quijote.jpg', description: 'La obra cumbre de la literatura española', publication_date: '1605-01-16', purchase_price: 299.99, author_id: aId('Miguel de Cervantes'), publisher_id: pId('Editorial Ejemplo'), category_id: cId('Histórica'), created_date: now }
    ];

    for (const r of rows) {
      if (!r.author_id || !r.publisher_id || !r.category_id) {
        throw new Error(`Seeder Books: no se encontró ID para "${r.name}". Verifica que Authors/Publishers/Categories se insertaron correctamente.`);
      }
    }

    await qi.bulkInsert('Book', rows);
  },

  async down(qi) {
    await qi.bulkDelete('Book', null, {});
  }
};
