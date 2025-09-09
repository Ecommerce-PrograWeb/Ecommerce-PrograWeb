import { describe, it, expect } from 'vitest';
import * as mod from '../../src/core/errors/http-error.js';

// Support both default and named export
const HttpError = mod.default || mod.HttpError;

describe('HttpError', () => {
  it('sets status and message', () => {
    const err = new HttpError(418, 'I am teapot');
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(418);
    expect(err.message).toBe('I am teapot');
    expect(err.stack).toBeTruthy();
  });
});
