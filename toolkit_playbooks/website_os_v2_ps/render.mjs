import { buildPage } from "./build/core/pipeline.js";

const ctx = {
  product: {
    slug: "page",
    name: "AI Funnel",
    price: 29,
    currency: "USD",
    description: "Launch faster with AI",
  },
  locale: "en-CA",
};

buildPage(ctx)
  .then((r) => console.log("[rendered]", r.outPath))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
