import { partial } from "../render.js";
export default {
  flag: "sticky_mobile_cta",
  async apply(html: string) {
    return html.replace("</body>", `${partial("sticky_cta.html")}</body>`);
  },
};
