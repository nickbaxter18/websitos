import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

declare global {
  // Loosen typing for test environment globals
  var TextEncoder: any;
  var TextDecoder: any;
}

global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;
