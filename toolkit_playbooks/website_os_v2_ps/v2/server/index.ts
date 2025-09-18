import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

import security from "./security";
import { createSession } from "./checkout";
import { stripeWebhook } from "./webhooks";
import { ingest } from "./events/ingest";
import { thankYouJSON } from "./thankyou";

const app = express();

function sendHtmlWithNonce(res: any, filePath: string) {
  const fs = require("fs");
  const p = require("path");
  const nonce = res && res.locals && res.locals.nonce ? res.locals.nonce : "";
  let html = fs.readFileSync(p.resolve(filePath), "utf-8");
  // add nonce to any <script ...> missing it
  html = html.replace(
    /<script(?![^>]*\bnonce=)([^>]*)>/g,
    (_m: string, attrs: string) => `<script nonce="${nonce}"${attrs}>`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}

// core middleware
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(security);

// static roots
app.use("/assets", express.static(path.resolve("v2/public/assets")));
app.use(express.static(path.resolve("v2/public")));
app.use(express.static(path.resolve("dist")));

// service worker at root
app.get("/sw.js", (_req, res) => res.sendFile(path.resolve("v2/public/sw.js")));

// APIs
app.post("/checkout", createSession);
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhook as any);
app.post("/events", ingest);
app.post("/api/leads", async (req, res) => {
  const { email, consent } = req.body || {};
  if (!email || !consent) return res.status(400).json({ ok: false });
  return res.json({ ok: true });
});

// thank-you JSON for client
app.get("/thank-you.json", thankYouJSON);

// pages (nonce-injected)
app.get("/favicon.ico", (_req, res) => res.status(204).end());
app.get("/thank-you", (_req, res) => sendHtmlWithNonce(res, "dist/thank-you.html"));
app.get("/", (_req, res) => sendHtmlWithNonce(res, "dist/page.html"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[server] listening on :${port}`));
import { thankYouJSON } from "./thankyou";
