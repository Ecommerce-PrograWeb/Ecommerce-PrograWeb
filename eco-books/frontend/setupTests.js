import '@testing-library/jest-dom';
import 'whatwg-fetch';

class NoopObserver { observe(){} unobserve(){} disconnect(){} }
global.ResizeObserver = NoopObserver;
global.IntersectionObserver = NoopObserver;
