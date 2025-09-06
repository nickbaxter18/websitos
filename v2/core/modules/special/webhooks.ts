export const Webhooks = {
  id: "webhooks",
  function: "webhooks",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["webhooks"],
  apply() {
    // Original logic
    import type { Request, Response } from "express";
    import Stripe from "stripe";
    import fs from "fs";
    import path from "path";
    import db, { insertEvent, hasProcessed, markProcessed } from "./warehouse/db";
    // If you still import routeEvent elsewhere, you can add:
    // import { routeEvent } from "./events/router";

    function loadCfg() {
      const p = path.resolve("v2/config/stripe_config.json");
      let raw = fs.readFileSync(p, "utf-8");
      raw = raw.replace(/^\uFEFF/, ""); // strip BOM
      return JSON.parse(raw);
    }
    function pickTenant(host?: string) {
      const h = (host || "").split(":")[0].toLowerCase();
      const cfg = loadCfg();
      return cfg.tenants && h in cfg.tenants ? h : "default";
    }

    export async function stripeWebhook(req: Request, res: Response) {
      try {
        const cfg = loadCfg();
        const tenant = pickTenant(req.headers.host as string);
        const mode = (cfg.mode || "test") as "test" | "live";
        const sk = cfg.tenants?.[tenant]?.[mode]?.sk || cfg.tenants?.default?.[mode]?.sk || "";
        if (!sk) return res.status(501).json({ error: "Stripe key not set" });

        const stripe = new Stripe(sk, { apiVersion: "2022-11-15" });

        const whsec =
          cfg.tenants?.[tenant]?.[mode]?.whsec || cfg.tenants?.default?.[mode]?.whsec || "";
        let event: any = req.body;

        if (whsec) {
          const sig = String(req.headers["stripe-signature"] || "");
          event = stripe.webhooks.constructEvent(req.body as any, sig, whsec);
        } else {
          // express.raw gives Buffer when no whsec is configured
          if (Buffer.isBuffer(event)) event = JSON.parse(event.toString("utf8"));
        }

        // Idempotency: drop duplicates early
        if (event && event.id && hasProcessed(event.id)) {
          return res.json({ received: true, dedup: true });
        }

        if (event.type === "checkout.session.completed") {
          const s = event.data?.object || {};
          // If you use routeEvent, you can uncomment:
          // routeEvent({ type:"purchase", uid: s?.customer || s?.id, ts: Date.now(),
          //   payload:{ email:s?.customer_details?.email, amount_total:s?.amount_total, currency:s?.currency } });

          // Persist purchase to warehouse
          insertEvent({
            uid: String(s?.customer || s?.id || ""),
            type: "purchase",
            ts: Date.now(),
            payload: {
              email: s?.customer_details?.email,
              amount_total: s?.amount_total,
              currency: s?.currency,
            },
          });
        }

        if (event && event.id) markProcessed(event.id);
        res.json({ received: true });
      } catch (e: any) {
        console.error("[webhook]", e?.message || e);
        res.sendStatus(500);
      }
    }
  },
  fallback() {
    console.warn("[webhooks] fallback safe mode.");
  },
  negotiate() {
    return "webhooks negotiates between system and culture.";
  },
  evolve() {
    return "webhooks evolves toward adaptive governance.";
  },
  coevolve() {
    return "webhooks coevolves with other modules.";
  },
  cultivate() {
    return "webhooks cultivates cultural resilience.";
  },
};
