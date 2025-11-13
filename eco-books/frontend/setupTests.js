require('@testing-library/jest-dom');
require('whatwg-fetch');

class NoopObserver { observe(){} unobserve(){} disconnect(){} }
global.ResizeObserver = NoopObserver;
global.IntersectionObserver = NoopObserver;
