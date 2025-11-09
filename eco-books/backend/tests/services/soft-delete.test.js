import { mockModels, resetMocks, mockSequelize } from '../mocks/soft-delete.mock.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { sequelize } from '../../src/config/database.js';
import * as UserService from '../../src/modules/service/user.service.js';
import BookService from '../../src/modules/service/book.service.js';
import OrderService from '../../src/modules/service/order.service.js';
import CartService from '../../src/modules/service/cart.service.js';

describe('Soft Delete Functionality', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('User Soft Delete', () => {
    it('should soft delete a user', async () => {
      const userId = 1;
      const result = await UserService.deleteUser(userId);
      
      expect(result).toBeDefined();
      expect(result.user_id).toBe(userId);
      expect(mockModels.User.destroy).toHaveBeenCalledWith({
        where: { user_id: userId }
      });
    });

    it('should restore a soft-deleted user', async () => {
      const userId = 1;
      const result = await UserService.restoreUser(userId);
      
      expect(result).toBeDefined();
      expect(result.user_id).toBe(userId);
      expect(mockModels.User.restore).toHaveBeenCalledWith({
        where: { user_id: userId }
      });
    });

    it('should throw error if user not found for delete', async () => {
      const userId = 999;
      mockModels.User.findByPk.mockResolvedValueOnce(null);

      await expect(UserService.deleteUser(userId)).rejects.toThrow();
    });
  });

  describe('Book Soft Delete', () => {
    it('should soft delete a book', async () => {
      const bookId = 1;
      const result = await BookService.deleteBook(bookId);
      
      expect(result).toBeDefined();
      expect(result.book_id).toBe(bookId);
      expect(mockModels.Book.destroy).toHaveBeenCalledWith({
        where: { book_id: bookId }
      });
    });

    it('should restore a soft-deleted book', async () => {
      const bookId = 1;
      const result = await BookService.restoreBook(bookId);
      
      expect(result).toBeDefined();
      expect(result.book_id).toBe(bookId);
      expect(mockModels.Book.restore).toHaveBeenCalledWith({
        where: { book_id: bookId }
      });
    });

    it('should throw error if book not found for delete', async () => {
      const bookId = 999;
      mockModels.Book.findByPk.mockResolvedValueOnce(null);

      await expect(BookService.deleteBook(bookId)).rejects.toThrow();
    });
  });

  describe('Order Soft Delete', () => {
    it('should soft delete an order', async () => {
      const orderId = 1;
      const result = await OrderService.deleteOrder(orderId);
      
      expect(result).toBeDefined();
      expect(result.order_id).toBe(orderId);
      expect(mockModels.Order.destroy).toHaveBeenCalledWith({
        where: { order_id: orderId }
      });
    });

    it('should restore a soft-deleted order', async () => {
      const orderId = 1;
      const result = await OrderService.restoreOrder(orderId);
      
      expect(result).toBeDefined();
      expect(result.order_id).toBe(orderId);
      expect(mockModels.Order.restore).toHaveBeenCalledWith({
        where: { order_id: orderId }
      });
    });

    it('should throw error if order not found for delete', async () => {
      const orderId = 999;
      mockModels.Order.findByPk.mockResolvedValueOnce(null);

      await expect(OrderService.deleteOrder(orderId)).rejects.toThrow();
    });
  });

  describe('Cart Soft Delete', () => {
    it('should soft delete a cart', async () => {
      const cartId = 1;
      const result = await CartService.deleteCart(cartId);
      
      expect(result).toBeDefined();
      expect(result.cart_id).toBe(cartId);
      expect(mockModels.Cart.destroy).toHaveBeenCalledWith({
        where: { cart_id: cartId }
      });
    });

    it('should restore a soft-deleted cart', async () => {
      const cartId = 1;
      const result = await CartService.restoreCart(cartId);
      
      expect(result).toBeDefined();
      expect(result.cart_id).toBe(cartId);
      expect(mockModels.Cart.restore).toHaveBeenCalledWith({
        where: { cart_id: cartId }
      });
    });

    it('should throw error if cart not found for delete', async () => {
      const cartId = 999;
      mockModels.Cart.findByPk.mockResolvedValueOnce(null);

      await expect(CartService.deleteCart(cartId)).rejects.toThrow();
    });
  });
});