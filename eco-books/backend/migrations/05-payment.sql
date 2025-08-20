USE eco_books;

-- Payment
create table IF NOT EXISTS Payment(
    payment_id int auto_increment primary key,
    order_id int,
    payment_date date not null,
    amount decimal(10,2) not null,
    payment_method varchar(100) not null
        check(payment_method in ('Cash', 'Card')),
    foreign key (order_id) references `Order`(order_id)
);

/*

-- Rollback (drop Payment table)
USE eco_books;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Payment`;
SET FOREIGN_KEY_CHECKS = 1;

*/