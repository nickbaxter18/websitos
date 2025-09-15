import { partial } from "../render.js";
export default {
  flag: "consent_mode",
  async apply(html: string) {
    const ga = (globalThis as any).process?.env?.GA4_ID || "G-BF3NB7NFEL";
    const c = partial("consent.html").replace(/%GA4_ID%/g, ga);
    return html.replace("</body>", c + "</body>");
  },
};
