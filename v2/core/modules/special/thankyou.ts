export const Thankyou = {
  id: "thankyou",
  function: "thankyou",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["thankyou"],
  apply() {
    // Original logic
    import fs from "fs";
    import path from "path";
    import Stripe from "stripe";

    function loadCfg() {
      const p = path.resolve("v2/config/stripe_config.json");
      let raw = fs.readFileSync(p, "utf-8");
      raw = raw.replace(/^\uFEFF/, "");
      return JSON.parse(raw);
    }
    function pickTenant(host?: string) {
      const h = (host || "").split(":")[0].toLowerCase();
      const cfg = loadCfg();
      return h in (cfg.tenants || {}) ? h : "default";
    }

    export async function thankYouJSON(req: any, res: any) {
      try {
        const sid = String((req.query || {}).session_id || "");
        if (!sid) return res.status(400).json({ error: "missing session_id" });
        const cfg = loadCfg();
        const tenant = pickTenant(req.headers.host);
        const mode = cfg.mode || "test";
        const sk = cfg.tenants?.[tenant]?.[mode]?.sk || cfg.tenants?.default?.[mode]?.sk || "";
        if (!sk) return res.status(501).json({ error: "Stripe key not set" });
        const stripe = new Stripe(sk, { apiVersion: "2022-11-15" });

        const s = await stripe.checkout.sessions.retrieve(sid, {
          expand: ["line_items", "customer_details"],
        });
        const out = {
          id: s.id,
          email: s.customer_details?.email || null,
          amount_total: s.amount_total,
          currency: s.currency,
          payment_status: s.payment_status,
          line_items: (s.line_items?.data || []).map((i) => ({
            desc: i.description,
            qty: i.quantity,
            amount_subtotal: i.amount_subtotal,
          })),
        };
        res.json(out);
      } catch (e: any) {
        console.error("[thankyou]", e?.message || e);
        res.status(500).json({ error: "server_error" });
      }
    }
  },
  fallback() {
    console.warn("[thankyou] fallback safe mode.");
  },
  negotiate() {
    return "thankyou negotiates between system and culture.";
  },
  evolve() {
    return "thankyou evolves toward adaptive governance.";
  },
  coevolve() {
    return "thankyou coevolves with other modules.";
  },
  cultivate() {
    return "thankyou cultivates cultural resilience.";
  },
};
