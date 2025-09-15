import flags from "../config/flags.json" with { type: "json" };
import { readTemplates, writeOut, type Ctx } from "./render.js";
import modules from "./modules/index.js";
export async function buildPage(ctx: Ctx) {
  let html = readTemplates(ctx);
  for (const m of modules) {
    if ((flags as any)[m.flag] !== false) html = await m.apply(html, ctx);
  }
  return writeOut(html, ctx);
}
export default { buildPage };
