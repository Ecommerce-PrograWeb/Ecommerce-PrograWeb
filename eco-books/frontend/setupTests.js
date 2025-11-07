import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Evita “Cannot redefine property: location”
const base = new URL('http://localhost/');
Object.defineProperty(window, 'location', {
    value: {
        ...window.location,
        href: base.href,
        assign: jest.fn(),
        replace: jest.fn(),
    },
    writable: true,
    configurable: true,
});

// Observers no-op (si tu UI los usa)
class NoopObserver { observe(){} unobserve(){} disconnect(){} }
global.ResizeObserver = NoopObserver;
global.IntersectionObserver = NoopObserver;
