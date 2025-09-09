import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../../src/core/errors/error-handler.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json  = vi.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  it('uses provided status and message', () => {
    const err = { status: 404, message: 'Not found' };
    const req = {}, res = mockRes(), next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('returns 500 when status is missing', () => {
    const err = new Error('boom'); // no status
    const req = {}, res = mockRes(), next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'boom' });
  });

  // Optional: covers the branch where status exists but message is missing
  it('uses default message when message is missing but status exists', () => {
    const err = { status: 400 }; // no message
    const req = {}, res = mockRes(), next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
