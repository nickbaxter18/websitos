import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

declare global {
  // Augment NodeJS global type so TextEncoder/TextDecoder exist
  var TextEncoder: typeof TextEncoder;
  var TextDecoder: typeof TextDecoder;
}

global.TextEncoder = TextEncoder;
// Cast to any to bypass type incompatibility
global.TextDecoder = TextDecoder as any;
