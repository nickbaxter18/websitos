// Jest setup file
// Polyfills for jsdom environment
import { TextEncoder, TextDecoder } from "util";

(global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
(global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
  TextDecoder as unknown as typeof TextDecoder;
