export default {
  flag: "utm_persist",
  async apply(html: string) {
    return html.replace("</body>", `<script src="/assets/analytics.js" defer></script></body>`);
  },
};
