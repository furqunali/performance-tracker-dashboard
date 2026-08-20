// Vitest global setup: extends `expect` with jest-dom matchers and clears
// browser storage between tests so the store shim starts from a clean slate.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Recharts' ResponsiveContainer relies on ResizeObserver, which jsdom
// does not implement. A no-op stub lets chart components mount in tests.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
