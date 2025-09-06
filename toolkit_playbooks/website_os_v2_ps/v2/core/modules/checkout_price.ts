export default {
  flag: "checkout_price",
  async apply(html: string) {
    const pid = (globalThis as any).process?.env?.STRIPE_PRICE_ID || "price_TEST";
    return html.replace("</head>", `<script>window.PRICE_ID='${pid}';</script></head>`);
  },
};
