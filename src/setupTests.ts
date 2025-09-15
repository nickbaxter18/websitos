import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

declare global {
  // Augment NodeJS global type so TextEncoder/TextDecoder exist
   
  var TextEncoder: typeof TextEncoder;
   
  var TextDecoder: typeof TextDecoder;
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
