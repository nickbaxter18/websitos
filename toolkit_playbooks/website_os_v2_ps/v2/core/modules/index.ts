import type { Ctx } from "../render.js";
type M = { flag: string; apply: (html: string, ctx: Ctx) => Promise<string> };

import lead from "./lead.js";
import ga4 from "./ga4.js";
import utm from "./utm_persist.js";
import consent from "./consent_mode.js";
import seo from "./seo_jsonld.js";
import sticky from "./sticky_mobile_cta.js";
import tagging from "./server_tagging.js";
import offers from "./offers.js";
import rum from "./rum_vitals.js";
import pwa from "./pwa_offline.js";
import checkout_price from "./checkout_price.js";
import checkout_sessions from "./checkout_sessions.js";

const modules: M[] = [
  lead,
  ga4,
  utm,
  consent,
  seo,
  sticky,
  tagging,
  offers,
  rum,
  pwa,
  checkout_price,
  checkout_sessions,
];
export default modules;
