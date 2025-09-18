import { partial } from "../render.js";
export default {
  flag: "ga4_events",
  async apply(html: string) {
    return html.replace("</head>", `${partial("ga4_head.html")}</head>`);
  },
};
