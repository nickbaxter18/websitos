import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for Node.js environment
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;
