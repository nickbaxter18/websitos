var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// v2/server/index.ts
var import_express = __toESM(require("express"), 1);
var import_path4 = __toESM(require("path"), 1);
var import_body_parser = __toESM(require("body-parser"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_morgan = __toESM(require("morgan"), 1);

// v2/server/security.ts
var import_helmet = __toESM(require("helmet"), 1);
function security(req, res, next) {
  (0, import_helmet.default)({ contentSecurityPolicy: false })(req, res, () => {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://js.stripe.com",
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://js.stripe.com",
      "connect-src 'self' https://www.google-analytics.com",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://js.stripe.com"
    ].join("; ");
    res.setHeader("Content-Security-Policy", csp);
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "interest-cohort=()");
    next();
  });
}

// v2/server/checkout.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_stripe = __toESM(require("stripe"), 1);
function loadCfg() {
  const p = import_path.default.resolve("v2/config/stripe_config.json");
  let raw = import_fs.default.readFileSync(p, "utf-8");
  raw = raw.replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}
function pickTenant(host) {
  const h = (host || "").split(":")[0].toLowerCase();
  const cfg = loadCfg();
  return h in cfg.tenants ? h : "default";
}
async function createSession(req, res) {
  try {
    const cfg = loadCfg();
    const tenant = pickTenant(req.headers.host);
    const mode = cfg.mode || "test";
    const sk = cfg.tenants?.[tenant]?.[mode]?.sk || cfg.tenants?.default?.[mode]?.sk || "";
    if (!sk || !sk.startsWith("sk_")) {
      return res.status(501).json({ error: "Stripe key not set for tenant/mode" });
    }
    const stripe = new import_stripe.default(sk, { apiVersion: "2022-11-15" });
    const sku = req.body?.sku || req.body?.productSlug || "offer";
    const reqPid = typeof req.body?.priceId === "string" ? req.body.priceId : "";
    const effectiveReqPid = reqPid && reqPid.startsWith("price_") ? reqPid : "";
    const mapped = cfg.products?.[tenant]?.[sku] || cfg.products?.default?.[sku] || "";
    const priceId = effectiveReqPid || mapped;
    if (!priceId || !priceId.startsWith("price_")) {
      return res.status(400).json({ error: `No price found for sku "${sku}" (tenant "${tenant}")` });
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
      customer_creation: "always"
    });
    return res.json({ url: s.url });
  } catch (e) {
    console.error("[checkout]", e?.message || e);
    return res.status(500).json({ error: e?.message || "server_error" });
  }
}

// v2/server/webhooks.ts
var import_stripe2 = __toESM(require("stripe"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);

// v2/server/warehouse/db.ts
var import_better_sqlite3 = __toESM(require("better-sqlite3"), 1);
var db = new import_better_sqlite3.default(process.env.WAREHOUSE_DB || "warehouse.db");
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT,
    type TEXT,
    ts INTEGER,
    payload TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_events_uid ON events(uid);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS processed_events (
    event_id TEXT PRIMARY KEY,
    ts INTEGER
  );
`);
function insertEvent(e) {
  db.prepare("INSERT INTO events(uid,type,ts,payload) VALUES (?,?,?,?)").run(e.uid, e.type, e.ts, JSON.stringify(e.payload || {}));
}
function hasProcessed(eventId) {
  return !!db.prepare("SELECT 1 FROM processed_events WHERE event_id=?").get(eventId);
}
function markProcessed(eventId) {
  db.prepare("INSERT OR IGNORE INTO processed_events(event_id,ts) VALUES (?,?)").run(eventId, Date.now());
}

// v2/server/webhooks.ts
function loadCfg2() {
  const p = import_path2.default.resolve("v2/config/stripe_config.json");
  let raw = import_fs2.default.readFileSync(p, "utf-8");
  raw = raw.replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}
function pickTenant2(host) {
  const h = (host || "").split(":")[0].toLowerCase();
  const cfg = loadCfg2();
  return cfg.tenants && h in cfg.tenants ? h : "default";
}
async function stripeWebhook(req, res) {
  try {
    const cfg = loadCfg2();
    const tenant = pickTenant2(req.headers.host);
    const mode = cfg.mode || "test";
    const sk = cfg.tenants?.[tenant]?.[mode]?.sk || cfg.tenants?.default?.[mode]?.sk || "";
    if (!sk)
      return res.status(501).json({ error: "Stripe key not set" });
    const stripe = new import_stripe2.default(sk, { apiVersion: "2022-11-15" });
    const whsec = cfg.tenants?.[tenant]?.[mode]?.whsec || cfg.tenants?.default?.[mode]?.whsec || "";
    let event = req.body;
    if (whsec) {
      const sig = String(req.headers["stripe-signature"] || "");
      event = stripe.webhooks.constructEvent(req.body, sig, whsec);
    } else {
      if (Buffer.isBuffer(event))
        event = JSON.parse(event.toString("utf8"));
    }
    if (event && event.id && hasProcessed(event.id)) {
      return res.json({ received: true, dedup: true });
    }
    if (event.type === "checkout.session.completed") {
      const s = event.data?.object || {};
      insertEvent({
        uid: String(s?.customer || s?.id || ""),
        type: "purchase",
        ts: Date.now(),
        payload: {
          email: s?.customer_details?.email,
          amount_total: s?.amount_total,
          currency: s?.currency
        }
      });
    }
    if (event && event.id)
      markProcessed(event.id);
    res.json({ received: true });
  } catch (e) {
    console.error("[webhook]", e?.message || e);
    res.sendStatus(500);
  }
}

// v2/server/events/ingest.ts
var import__ = __toESM(require("ajv/dist/2020"), 1);
var import_ajv_formats = __toESM(require("ajv-formats"), 1);

// v2/server/schemas/events.v1.json
var events_v1_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://udigit.ca/schemas/events.v1.json",
  type: "object",
  required: ["type", "ts"],
  properties: {
    type: { type: "string" },
    uid: { type: "string" },
    trace_id: { type: "string" },
    consent: { type: "string", enum: ["accepted", "declined", "unknown"] },
    payload: { type: "object", additionalProperties: true },
    ts: { type: "number" }
  },
  additionalProperties: false
};

// v2/server/events/router.ts
function routeEvent(e) {
  switch (e.type) {
    case "lead_submit":
      return sendSequence("lead_capture", e);
    case "purchase":
      return sendSequence("post_purchase", e);
    case "nps_score":
      return e.score <= 6 ? sendSequence("retention_fix", e) : sendSequence("advocacy", e);
    case "cancel_start":
      return scheduleWinback(e.uid);
    default:
      return;
  }
}
function sendSequence(name, e) {
  console.log("[sequence]", name, e.uid || "");
}
function scheduleWinback(uid) {
  console.log("[winback scheduled]", uid);
}

// v2/server/events/ingest.ts
var ajv = new import__.default({ allErrors: true });
(0, import_ajv_formats.default)(ajv);
var validate = ajv.compile(events_v1_default);
async function ingest(req, res) {
  const data = req.body;
  if (!validate(data))
    return res.status(400).json({ ok: false, errors: validate.errors });
  if (data.consent === "declined")
    return res.json({ ok: true, dropped: true });
  try {
    await forwardGA4(data);
  } catch {
  }
  try {
    routeEvent(data);
  } catch {
  }
  res.json({ ok: true });
}
async function forwardGA4(evt) {
  if (!process.env.GA4_API_SECRET || !process.env.GA4_ID)
    return;
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_ID}&api_secret=${process.env.GA4_API_SECRET}`;
  const body = { client_id: evt.uid || "anon", events: [{ name: evt.type || "event", params: evt.payload || {} }] };
  await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
}

// v2/server/thankyou.ts
var import_fs3 = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_stripe3 = __toESM(require("stripe"), 1);
function loadCfg3() {
  const p = import_path3.default.resolve("v2/config/stripe_config.json");
  let raw = import_fs3.default.readFileSync(p, "utf-8");
  raw = raw.replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}
function pickTenant3(host) {
  const h = (host || "").split(":")[0].toLowerCase();
  const cfg = loadCfg3();
  return h in (cfg.tenants || {}) ? h : "default";
}
async function thankYouJSON(req, res) {
  try {
    const sid = String((req.query || {}).session_id || "");
    if (!sid)
      return res.status(400).json({ error: "missing session_id" });
    const cfg = loadCfg3();
    const tenant = pickTenant3(req.headers.host);
    const mode = cfg.mode || "test";
    const sk = cfg.tenants?.[tenant]?.[mode]?.sk || cfg.tenants?.default?.[mode]?.sk || "";
    if (!sk)
      return res.status(501).json({ error: "Stripe key not set" });
    const stripe = new import_stripe3.default(sk, { apiVersion: "2022-11-15" });
    const s = await stripe.checkout.sessions.retrieve(sid, { expand: ["line_items", "customer_details"] });
    const out = {
      id: s.id,
      email: s.customer_details?.email || null,
      amount_total: s.amount_total,
      currency: s.currency,
      payment_status: s.payment_status,
      line_items: (s.line_items?.data || []).map((i) => ({ desc: i.description, qty: i.quantity, amount_subtotal: i.amount_subtotal }))
    };
    res.json(out);
  } catch (e) {
    console.error("[thankyou]", e?.message || e);
    res.status(500).json({ error: "server_error" });
  }
}

// v2/server/index.ts
var app = (0, import_express.default)();
function sendHtmlWithNonce(res, filePath) {
  const fs4 = require("fs");
  const p = require("path");
  const nonce = res && res.locals && res.locals.nonce ? res.locals.nonce : "";
  let html = fs4.readFileSync(p.resolve(filePath), "utf-8");
  html = html.replace(/<script(?![^>]*\bnonce=)([^>]*)>/g, (_m, attrs) => `<script nonce="${nonce}"${attrs}>`);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}
app.use((0, import_cors.default)());
app.use((0, import_morgan.default)("tiny"));
app.use(import_body_parser.default.json({ limit: "1mb" }));
app.use(security);
app.use("/assets", import_express.default.static(import_path4.default.resolve("v2/public/assets")));
app.use(import_express.default.static(import_path4.default.resolve("v2/public")));
app.use(import_express.default.static(import_path4.default.resolve("dist")));
app.get("/sw.js", (_req, res) => res.sendFile(import_path4.default.resolve("v2/public/sw.js")));
app.post("/checkout", createSession);
app.post("/webhooks/stripe", import_express.default.raw({ type: "application/json" }), stripeWebhook);
app.post("/events", ingest);
app.post("/api/leads", async (req, res) => {
  const { email, consent } = req.body || {};
  if (!email || !consent)
    return res.status(400).json({ ok: false });
  return res.json({ ok: true });
});
app.get("/thank-you.json", thankYouJSON);
app.get("/favicon.ico", (_req, res) => res.status(204).end());
app.get("/thank-you", (_req, res) => sendHtmlWithNonce(res, "dist/thank-you.html"));
app.get("/", (_req, res) => sendHtmlWithNonce(res, "dist/page.html"));
var port = process.env.PORT || 3e3;
app.listen(port, () => console.log(`[server] listening on :${port}`));
//# sourceMappingURL=index.cjs.map
