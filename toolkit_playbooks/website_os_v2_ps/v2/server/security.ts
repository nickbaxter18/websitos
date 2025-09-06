import helmet from "helmet";
import type { Request, Response, NextFunction } from "express";

/**
 * DEV policy: allow inline + GA/Unpkg/Stripe so injected modules run.
 * Helmet still sets other headers, but NOT CSP (we set it).
 */
export default function security(req: Request, res: Response, next: NextFunction) {
  // Let helmet set everything EXCEPT CSP
  helmet({ contentSecurityPolicy: false })(req, res, () => {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://js.stripe.com",
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://js.stripe.com",
      "connect-src 'self' https://www.google-analytics.com",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://js.stripe.com",
    ].join("; ");
    res.setHeader("Content-Security-Policy", csp);
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "interest-cohort=()");
    next();
  });
}
