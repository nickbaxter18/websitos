import fs from "fs";
import path from "path";
export type Ctx = { product?: any; persona?: any; tenant?: string; locale?: string };
const root = path.resolve(process.cwd(), "v2");
const T = (f: string) => fs.readFileSync(path.join(root, "templates", f), "utf-8");
const P = (f: string) => fs.readFileSync(path.join(root, "templates", "partials", f), "utf-8");
export function readTemplates(ctx: Ctx) {
  let html = T("layout.html");
  html = html
    .replace("{{HEAD}}", P("head.html"))
    .replace("{{HEADER}}", P("header.html"))
    .replace("{{FOOTER}}", P("footer.html"));
  html = html
    .replace(/{{GA4_ID}}/g, process.env.GA4_ID || "G-BF3NB7NFEL")
    .replace(/{{SUPPORT_EMAIL}}/g, process.env.SUPPORT_EMAIL || "nickbaxter@udigit.ca");
  return html;
}
export function writeOut(html: string, ctx: Ctx) {
  const out = "dist";
  fs.mkdirSync(out, { recursive: true });
  const slug = (ctx.product?.slug || "page") + ".html";
  const p = path.join(out, slug);
  fs.writeFileSync(p, html);
  return { outPath: p, html };
}
export function partial(name: string) {
  return P(name);
}
