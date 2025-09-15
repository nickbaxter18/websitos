import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder for React Router and other libs in Jest
import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;