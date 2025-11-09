'use strict';

module.exports = {
  async up(qi) {
    const now = new Date();

    await qi.bulkInsert('Role', [
      { type: 'Customer', created_date: now },
      { type: 'Admin', created_date: now }
    ]);

    await qi.bulkInsert('Author', [
      { name: 'Miguel de Cervantes', created_date: now },
      { name: 'Gabriel Garcia Marquez', created_date: now },
      { name: 'Rebecca Yarros', created_date: now },
      { name: 'Mel Robbins', created_date: now },
      { name: 'Suzanne Collins', created_date: now },
      { name: 'J.K. Rowling', created_date: now },
      { name: 'Stephen King', created_date: now },
      { name: 'Agatha Christie', created_date: now },
      { name: 'George R.R. Martin', created_date: now },
      { name: 'Paulo Coelho', created_date: now },
      { name: 'Dan Brown', created_date: now },
      { name: 'Gillian Flynn', created_date: now },
      { name: 'John Green', created_date: now },
      { name: 'Margaret Atwood', created_date: now },
      { name: 'Isaac Asimov', created_date: now }
    ]);

    await qi.bulkInsert('Publisher', [
      { name: 'Editorial Ejemplo', created_date: now },
      { name: 'Penguin Random House', created_date: now },
      { name: 'HarperCollins', created_date: now },
      { name: 'Bloomsbury', created_date: now },
      { name: 'Scribner', created_date: now },
      { name: 'Crown Publishing', created_date: now },
      { name: 'Bantam Doubleday Dell', created_date: now }
    ]);

    await qi.bulkInsert('Category', [
      { name: 'Acción', created_date: now },
      { name: 'Aventura', created_date: now },
      { name: 'Romance', created_date: now },
      { name: 'Fantasía', created_date: now },
      { name: 'Novela', created_date: now },
      { name: 'Suspenso', created_date: now },
      { name: 'Terror', created_date: now },
      { name: 'Misterio', created_date: now },
      { name: 'Ciencia Ficción', created_date: now },
      { name: 'Autoayuda', created_date: now },
      { name: 'Thriller', created_date: now },
      { name: 'Drama', created_date: now },
      { name: 'Histórica', created_date: now }
    ]);

    await qi.bulkInsert('Address', [
      { city: 'Madrid', zone: 'Centro', name: 'Casa Juan', created_date: now },
      { city: 'Bogota', zone: 'Norte', name: 'Casa Admin', created_date: now }
    ]);
  },

  async down(qi) {
    await qi.bulkDelete('Address', null, {});
    await qi.bulkDelete('Category', null, {});
    await qi.bulkDelete('Publisher', null, {});
    await qi.bulkDelete('Author', null, {});
    await qi.bulkDelete('Role', null, {});
  }
};
