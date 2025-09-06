export const Ingest = {
  id: "ingest",
  function: "ingest",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["ingest"],
  apply() {
    // Original logic
    import type { Request, Response } from "express";
    import Ajv2020 from "ajv/dist/2020"; // ✅ draft 2020-12 engine
    import addFormats from "ajv-formats";
    import schema from "../schemas/events.v1.json" assert { type: "json" };
    import { routeEvent } from "./router";

    // Ajv v8 configured for 2020-12
    const ajv = new Ajv2020({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema as any);

    export async function ingest(req: Request, res: Response) {
      const data = req.body;
      if (!validate(data)) return res.status(400).json({ ok: false, errors: validate.errors });
      if (data.consent === "declined") return res.json({ ok: true, dropped: true });

      try {
        await forwardGA4(data);
      } catch {}
      try {
        routeEvent(data);
      } catch {}
      res.json({ ok: true });
    }

    async function forwardGA4(evt: any) {
      if (!process.env.GA4_API_SECRET || !process.env.GA4_ID) return;
      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_ID}&api_secret=${process.env.GA4_API_SECRET}`;
      const body = {
        client_id: evt.uid || "anon",
        events: [{ name: evt.type || "event", params: evt.payload || {} }],
      };
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    }
  },
  fallback() {
    console.warn("[ingest] fallback safe mode.");
  },
  negotiate() {
    return "ingest negotiates between system and culture.";
  },
  evolve() {
    return "ingest evolves toward adaptive governance.";
  },
  coevolve() {
    return "ingest coevolves with other modules.";
  },
  cultivate() {
    return "ingest cultivates cultural resilience.";
  },
};
