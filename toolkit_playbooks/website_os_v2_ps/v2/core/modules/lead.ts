import { partial } from "../render.js";
export default {
  flag: "lead_form_v2",
  async apply(html: string) {
    return html.replace("</main>", `${partial("lead_form.html")}</main>`);
  },
};
