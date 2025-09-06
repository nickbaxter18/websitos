export default {
  flag: "seo_jsonld",
  async apply(html: string, ctx: any) {
    const p = ctx?.product || {
      name: "AI Funnel",
      description: "Launch faster with AI",
      price: 29,
      currency: "USD",
    };
    const j = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      offers: { "@type": "Offer", price: String(p.price), priceCurrency: p.currency },
    };
    const s = `<script type="application/ld+json">${JSON.stringify(j)}</script><meta property="og:title" content="${p.name}"><meta property="og:description" content="${p.description}">`;
    return html.replace("</head>", `${s}</head>`);
  },
};
