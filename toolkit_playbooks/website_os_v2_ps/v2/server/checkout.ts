import fs from "fs";
import path from "path";
import type { Request, Response } from "express";
import Stripe from "stripe";

type StripeCfg = {
  mode: "test" | "live";
  tenants: Record<string, { test?: { sk?: string }; live?: { sk?: string } }>;
  products: Record<string, Record<string, string>>;
};

function loadCfg(): StripeCfg {
  const p = path.resolve("v2/config/stripe_config.json");
  let raw = fs.readFileSync(p, "utf-8");
  raw = raw.replace(/^\uFEFF/, ""); // strip BOM if present
  return JSON.parse(raw);
}
function pickTenant(host?: string) {
  const h = (host || "").split(":")[0].toLowerCase();
  const cfg = loadCfg();
  return h in cfg.tenants ? h : "default";
}

export async function createSession(req: Request, res: Response) {
  try {
    const cfg = loadCfg();
    const tenant = pickTenant(req.headers.host);
    const mode = (cfg.mode || "test") as "test" | "live";

    const sk = cfg.tenants?.[tenant]?.[mode]?.sk || cfg.tenants?.default?.[mode]?.sk || "";

    if (!sk || !sk.startsWith("sk_")) {
      return res.status(501).json({ error: "Stripe key not set for tenant/mode" });
    }

    const stripe = new Stripe(sk, { apiVersion: "2022-11-15" });

    const sku = (req.body?.sku || req.body?.productSlug || "offer") as string;

    // Only trust client priceId when it looks like a real Stripe price
    const reqPid = typeof req.body?.priceId === "string" ? req.body.priceId : "";
    const effectiveReqPid = reqPid && reqPid.startsWith("price_") ? reqPid : "";

    const mapped = cfg.products?.[tenant]?.[sku] || cfg.products?.default?.[sku] || "";

    const priceId = effectiveReqPid || mapped;

    if (!priceId || !priceId.startsWith("price_")) {
      return res
        .status(400)
        .json({ error: `No price found for sku "${sku}" (tenant "${tenant}")` });
    }

    const utm = req.body?.utm || {};
    const persona = req.body?.persona || "default";
    const BASE = process.env.BASE_URL || `http://${req.headers.host || "localhost:3000"}`;

    const s = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE}/cancel`,
      metadata: { ...utm, persona, tenant, sku },
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      customer_creation: "always",
    });

    return res.json({ url: s.url });
  } catch (e: any) {
    console.error("[checkout]", e?.message || e);
    return res.status(500).json({ error: e?.message || "server_error" });
  }
}
