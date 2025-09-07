import React from "react";
import "../styles/udig.css";

export default function Home() {
  return (
    <>
      <section className="udig-home" data-component="udig-home">
        {/* === HERO === */}
        <div className="hero">
          <div className="container">
            <div className="grid">
              <div className="stack">
                <div className="kicker">We drop it. U-Dig It.</div>
                <h1>Rent a Pro-Grade Skid Steer in Saint John — Fast Delivery, Zero Hassle</h1>
                <p>
                  Book a <strong>Kubota SVL-75-3</strong>. Flexible availability, quick orientation
                  at drop-off, and transparent pricing. Homeowners and contractors welcome.
                </p>
                <div className="cta-row">
                  <a className="btn primary" href="#quote">
                    Get Availability &amp; Quote
                  </a>
                  <a className="btn call" href="tel:+15066431575">
                    Call 1-506-643-1575
                  </a>
                  <a className="btn ghost" href="sms:+15066431575">
                    Text Us
                  </a>
                </div>
                <div className="trustbar">
                  <span className="tag">CSA Safety Focus</span>
                  <span className="tag">Local Float From $150/way</span>
                  <span className="tag">Quick Insurance Guidance</span>
                  <span className="tag">Hampton ↔ Grand Bay-Westfield</span>
                </div>
              </div>

              {/* Hero Quote Card */}
              <div className="hero-card">
                <h2 style={{ margin: "0 0 10px" }}>Quick Availability Check</h2>
                <p style={{ margin: "0 0 14px" }}>
                  Send your dates and get a fast text/email back.
                </p>
                <form
                  className="mini-quote"
                  id="miniQuote"
                  action="/wp-admin/admin-post.php"
                  method="post"
                  noValidate
                >
                  <input type="hidden" name="action" value="udig_submit" />
                  <input type="hidden" name="form_id" value="quotePanel" />
                  <input type="hidden" name="source" value="home_quotePanel" />
                  <input type="hidden" name="_udig_anchor" value="quote" />
                  <div className="row">
                    <input required name="name" placeholder="Name" autoComplete="name" />
                    <input
                      required
                      name="phone"
                      placeholder="Phone"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </div>
                  <div className="row" style={{ marginTop: "10px" }}>
                    <input name="start" type="date" />
                    <input name="end" type="date" />
                    <input
                      name="address"
                      placeholder="Job Site Address"
                      autoComplete="street-address"
                    />
                    <select name="timeline" aria-label="Timeline">
                      <option value="ASAP">Timeline: ASAP</option>
                      <option>1–2 weeks</option>
                      <option>2–4 weeks</option>
                      <option>Planning</option>
                    </select>
                  </div>
                  <div className="subtle">
                    We reply promptly during business hours. We never share your info.
                  </div>
                  <div className="cta-row" style={{ marginTop: "10px" }}>
                    <button className="btn primary" type="submit">
                      Request Quote
                    </button>
                    <a className="btn ghost" href="sms:+15066431575">
                      Text Us Instead
                    </a>
                    <a className="btn ghost" href="/rent-now/" aria-label="Open full booking form">
                      Open Full Booking Form
                    </a>
                  </div>
                  <div className="optin">
                    <div className="headline">Get openings &amp; local deals first</div>
                    <div className="copy">
                      First dibs on openings, weekend specials, and new attachments.
                    </div>
                    <label className="optin-check">
                      <input type="checkbox" name="newsletter_optin" value="yes" />
                      <span>U-Dig It insider list</span>
                    </label>
                    <div className="trustline">Unsubscribe at any time.</div>
                  </div>
                  <input
                    type="text"
                    name="project"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* === BENEFITS === */}
        <div className="section benefits">
          <div className="container">
            <h2>Why Book With U-Dig It</h2>
            <div className="cards" style={{ marginTop: "12px" }}>
              <div className="card">
                <h3>Fast Delivery</h3>
                <p>
                  We float the machine to your site and give a quick orientation so you can start
                  immediately.
                </p>
              </div>
              <div className="card">
                <h3>Homeowner-Friendly</h3>
                <p>
                  Simple process, insurance guidance, and safety support designed for first-time
                  operators.
                </p>
              </div>
              <div className="card">
                <h3>Transparent Pricing</h3>
                <p>
                  No surprises. Clear day/week rates and{" "}
                  <strong>local float from $150 each way</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === PRICING TEASER === */}
        <div id="pricing" className="section pricing">
          <div className="container">
            <h2>Simple Rates, Clear Inclusions</h2>
            <div className="tiers" style={{ marginTop: "12px" }}>
              {/* Daily */}
              <div className="tier" data-price="449" data-days="1">
                <h3>Daily</h3>
                <div className="price">
                  <span className="now">$449</span>
                  <span className="was">$500</span>
                  <span className="per">
                    ≈ <span className="percalc">/day</span>
                  </span>
                </div>
                <span className="note">Grand Opening Sale — Limited spots</span>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Includes orientation at delivery</p>
                </div>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Reasonable cleaning included</p>
                </div>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Fuel at return policy</p>
                </div>
                <span className="fineprint">Taxes, deposit, float &amp; insurance apply.</span>
                <a className="btn primary" href="#quote" data-analytics="cta_price_day">
                  Book 1 Day
                </a>
              </div>

              {/* Long Weekend — Popular */}
              <div className="tier popular" data-price="1500" data-days="4">
                <div className="save-pill">One Day Free</div>
                <div className="badge">Most Popular</div>
                <h3>Long Weekend</h3>
                <div className="price">
                  <span className="now">$1,500</span>
                  <span className="per">
                    ≈ <span className="percalc">/day</span>
                  </span>
                </div>
                <span className="note">
                  Pay 3 days, get One <strong>FREE</strong>
                </span>
                <span className="value-line">
                  Includes Friday morning delivery window &amp; Monday evening return
                </span>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Orientation at delivery — start confidently</p>
                </div>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Local float from $150/way</p>
                </div>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Attachments billed per need</p>
                </div>
                <span className="fineprint">Taxes, deposit, float &amp; insurance apply.</span>
                <a
                  className="btn primary"
                  href="#quote"
                  data-analytics="cta_price_weekend"
                  aria-label="Lock my Weekend rental with Monday free"
                >
                  Lock My Weekend
                </a>
              </div>

              {/* Weekly */}
              <div className="tier" data-price="2500" data-days="7">
                <h3>Weekly</h3>
                <div className="price">
                  <span className="now">$2,500</span>
                  <span className="per">
                    ≈ <span className="percalc">/day</span>
                  </span>
                </div>
                <span className="note">Best value for projects</span>
                <span className="value-line">
                  Includes <strong>Free Float Both Ways</strong> ($300+ value)
                </span>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Flexible start days</p>
                </div>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Priority scheduling</p>
                </div>
                <div className="bullet">
                  <span className="dot"></span>
                  <p>Orientation at delivery</p>
                </div>
                <span className="fineprint">Taxes, deposit, float &amp; insurance apply.</span>
                <a className="btn primary" href="#quote" data-analytics="cta_price_week">
                  Reserve My Week
                </a>
              </div>
            </div>

            <p style={{ marginTop: "10px" }} className="muted">
              Taxes, deposit, and insurance requirements apply. See{" "}
              <a href="/terms-and-conditions/">Terms</a>.
            </p>
          </div>
        </div>

        {/* === DELIVERY & COVERAGE === */}
        <div id="delivery" className="section delivery">
          <div className="container">
            <h2>Delivery &amp; Service Area</h2>
            <div className="stack" style={{ marginTop: "12px" }}>
              <div id="serviceMap" className="mapbox" style={{ height: "340px" }}></div>

              <p className="muted" style={{ fontSize: "14px" }}>
                Flat float ($150/way) includes up to <strong>30 km by road</strong> from our yard.
                Additional distance is billed at <strong>$3.00/km + HST (each way)</strong>,
                measured by the Google Maps fastest route, Rounded to the nearest Kilometer. We
                confirm the total before booking.
              </p>
              <p>
                Prefer pickup? Ask about self-haul requirements (rated truck/trailer, hitch, and
                proper tie-downs).
              </p>
              <p style={{ marginTop: "4px" }}>
                <a
                  href="https://www.google.com/maps/place/945+Golden+Grove+Rd,+Saint+John,+NB+E2H+2X1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* === INSURANCE GUIDANCE === */}
        <div id="insurance" className="section insurance">
          <div className="container">
            <h2>Insurance Made Simple</h2>
            <p>
              Required: <strong>$2M Commercial General Liability</strong> (U-Dig It Rentals Inc. as{" "}
              <em>Additional Insured</em>) +<strong>$120,000 Rented/Leased Equipment</strong> (U-Dig
              It Rentals Inc. as <em>Loss Payee</em>) that covers your rental dates.
              <a href="/getting-insurance/">See the guide &amp; broker email template</a>.
            </p>

            <div className="cards" style={{ marginTop: "10px" }}>
              <div className="card">
                <div className="broker-name">John Walker Insurance (Saint John)</div>
                <div className="contact-row">
                  <a className="phone" href="tel:+15066331990">
                    1-506-633-1990
                  </a>
                  <a className="email" href="mailto:sales@johnwalkerinsurance.com">
                    sales@johnwalkerinsurance.com
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="broker-name">Mitchell McConnell Insurance (Saint John)</div>
                <div className="contact-row">
                  <a className="phone" href="tel:+15066347200">
                    1-506-634-7200
                  </a>
                  <a className="email" href="mailto:info@mitchellmcconnell.com">
                    info@mitchellmcconnell.com
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="broker-name">BrokerLink — Saint John (Rothesay Ave)</div>
                <div className="contact-row">
                  <a className="phone" href="tel:+15066350760">
                    1-506-635-0760
                  </a>
                  <a className="email" href="mailto:nbservice@brokerlink.ca">
                    nbservice@brokerlink.ca
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="broker-name">Higgins Insurance (Quispamsis)</div>
                <div className="contact-row">
                  <a className="phone" href="tel:+15068497800">
                    1-506-849-7800
                  </a>
                  <a className="email" href="mailto:info@higginsinsurance.ca">
                    info@higginsinsurance.ca
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === GALLERY — Before & After === */}
        <div className="section gallery">
          <div className="container">
            <h2>Before &amp; After</h2>
            <div className="ba-grid">
              {/* Pair 1 */}
              <figure className="ba" aria-label="Driveway regrading comparison">
                <img
                  className="ba-after"
                  loading="lazy"
                  alt="Driveway after regrading"
                  src="https://udigit.ca/wp-content/uploads/2025/08/2-1.png"
                />
                <img
                  className="ba-before"
                  loading="lazy"
                  alt="Driveway before regrading"
                  src="https://udigit.ca/wp-content/uploads/2025/08/drivewaybefore.png"
                />
                <input
                  className="ba-slider"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  aria-label="Reveal after image"
                />
                <span className="ba-tag before">Before</span>
                <span className="ba-tag after">After</span>
              </figure>

              {/* Pair 2 */}
              <figure className="ba" aria-label="Yard grading comparison">
                <img
                  className="ba-after"
                  loading="lazy"
                  alt="Yard after grading"
                  src="https://udigit.ca/wp-content/uploads/2025/08/After-1.png"
                />
                <img
                  className="ba-before"
                  loading="lazy"
                  alt="Yard before grading"
                  src="https://udigit.ca/wp-content/uploads/2025/08/before-2.png"
                />
                <input
                  className="ba-slider"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  aria-label="Reveal after image"
                />
                <span className="ba-tag before">Before</span>
                <span className="ba-tag after">After</span>
              </figure>
            </div>
          </div>
        </div>
        {/* === PROMISES / STANDARDS === */}
        <div className="section trust">
          <div className="container">
            <h2>Our Promises &amp; Standards</h2>
            <div className="cards" style={{ marginTop: "12px" }}>
              <div className="card">
                <h3>Clear, Honest Pricing</h3>
                <ul className="checklist">
                  <li>Written quote before you pay — no hidden fees.</li>
                  <li>Local float from $150/way, itemized on the quote.</li>
                  <li>Fuel, cleaning, and deposit policies stated upfront.</li>
                </ul>
                <a className="btn primary" href="#pricing">
                  See pricing &amp; inclusions
                </a>
              </div>
              <div className="card">
                <h3>Safety-First Operation</h3>
                <ul className="checklist">
                  <li>Quick orientation at delivery so you can start confidently.</li>
                  <li>CSA PPE guidance and simple operator checklists.</li>
                  <li>Phone/text support if anything is unclear.</li>
                </ul>
                <a className="btn primary" href="/safety-guidance/">
                  View Safety Guidance
                </a>
              </div>
              <div className="card">
                <h3>Insurance Made Simple</h3>
                <ul className="checklist">
                  <li>$2M CGL + $120,000 rented equipment coverage required.</li>
                  <li>Binder email template and local brokers to help you same-day.</li>
                  <li>We verify your COI before release for everyone’s protection.</li>
                </ul>
                <a className="btn primary" href="/getting-insurance/">
                  Get insurance guidance
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* === CTA BAND === */}
        <div className="section">
          <div className="container">
            <div className="cta-band">
              <div>
                <h2 style={{ margin: "0" }}>Ready to lock in your dates?</h2>
                <p style={{ margin: "6px 0 0" }}>
                  Get a fast quote now — we’ll confirm availability and next steps.
                </p>
              </div>
              <div className="cta-row" style={{ margin: "0" }}>
                <a className="btn primary" href="#quote" data-analytics="cta_band_quote">
                  Get Availability &amp; Quote
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* === FAQ === */}
        <div id="faq" className="section">
          <div className="container">
            <h2>Top Questions</h2>
            <div className="cards" style={{ marginTop: "12px" }}>
              <div className="card">
                <h3>Who can rent?</h3>
                <p>
                  Adults 21+ who provide ID, meet training/competency needs, and can meet insurance
                  &amp; deposit requirements.
                </p>
                <a className="btn primary" href="/faq/">
                  Read full FAQ →
                </a>
              </div>
              <div className="card">
                <h3>Do I need insurance?</h3>
                <p>Yes — $2M CGL + $120,000 rented equipment. We’ll guide you and your broker.</p>
                <a className="btn primary" href="/getting-insurance/">
                  Insurance guide →
                </a>
              </div>
              <div className="card">
                <h3>Delivery?</h3>
                <p>Yes — local float available (from $150 per way), quoted at booking.</p>
                <a className="btn primary" href="#delivery">
                  See delivery details →
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* === QUOTE & CONTACT === */}
        <div id="quote" className="section">
          <div className="container">
            <div className="panel">
              <h2>Get Availability &amp; Quote</h2>
              <p>
                Prefer the full form? <a href="/rent-now/">Go to the booking page</a>. Have
                questions? <a href="tel:+15066431575">Call 1-506-643-1575</a> or
                <a href="mailto:nickbaxter@udigit.ca"> email us</a>.
              </p>

              <form
                className="mini-quote"
                id="quoteForm"
                action="/wp-admin/admin-post.php"
                method="post"
                noValidate
              >
                <input type="hidden" name="action" value="udig_submit" />
                <input type="hidden" name="source" value="home_quotePanel" />
                <input type="hidden" name="form_id" value="quoteForm" />
                <input type="hidden" name="_udig_anchor" value="quote" />

                <div className="row">
                  <input required name="name" placeholder="Name" autoComplete="name" />
                  <input
                    required
                    name="phone"
                    placeholder="Phone"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                  />
                </div>

                <div className="row" style={{ marginTop: "10px" }}>
                  <input name="start" type="date" />
                  <input name="end" type="date" />
                  <input
                    name="address"
                    placeholder="Job Site Address"
                    autoComplete="street-address"
                  />
                  <select name="timeline" aria-label="Timeline">
                    <option value="ASAP">Timeline: ASAP</option>
                    <option>1–2 weeks</option>
                    <option>2–4 weeks</option>
                    <option>Planning</option>
                  </select>
                </div>

                <div className="subtle">
                  We reply promptly during business hours. We never share your info.
                </div>

                <div className="cta-row" style={{ marginTop: "10px" }}>
                  <button className="btn primary" type="submit" data-analytics="cta_form_submit">
                    Request Quote
                  </button>
                  <a className="btn ghost" href="sms:+15066431575" data-analytics="cta_form_sms">
                    Text Us Instead
                  </a>
                  <a className="btn ghost" href="/rent-now/" aria-label="Open full booking form">
                    Open Full Booking Form
                  </a>
                </div>

                <div className="optin">
                  <div className="headline">Get openings &amp; local deals first</div>
                  <div className="copy">
                    First dibs on openings, weekend specials, and new attachments.
                  </div>
                  <label className="optin-check">
                    <input type="checkbox" name="newsletter_optin" value="yes" />
                    <span>U-Dig It insider list</span>
                  </label>
                  <div className="trustline">Unsubscribe at any time.</div>
                </div>

                {/* Honeypot field */}
                <input
                  type="text"
                  name="project"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
                />
              </form>

              {/* Policies Summary Panel */}
              <div className="panel policy" style={{ marginTop: "14px" }}>
                <h2 style={{ fontSize: "18px", margin: "0 0 8px" }}>Key Policies (Summary)</h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gap: "8px",
                    color: "#111827",
                  }}
                >
                  <li>
                    <strong>Delivery:</strong> Float charge <strong>$150 + HST per way</strong>{" "}
                    (Delivery $150, Pickup $150).
                  </li>
                  <li>
                    <strong>Fuel:</strong> <em>Diesel only</em>; return full or{" "}
                    <strong>$100 + HST refueling</strong> applies.
                  </li>
                  <li>
                    <strong>Cleaning:</strong> Pressure wash yourself or skip cleaning for a{" "}
                    <strong>$100 + HST convenience fee</strong>.
                  </li>
                  <li>
                    <strong>Optional Damage Waiver:</strong> <strong>12% + HST</strong> — covers
                    minor accidental damage (scratches, small dents, hose leaks); excludes major
                    damage, misuse, theft.
                  </li>
                  <li>
                    <strong>$1000:</strong> Hold due one week prior to delivery (reduced to{" "}
                    <strong>$500</strong> if you add the Optional Damage Waiver); refunded after
                    return (clean, fueled, undamaged) minus any applicable fees.
                  </li>
                  <li>
                    <strong>Cancellation:</strong> Free ≥72h; <strong>50%</strong> between 72–24h;{" "}
                    <strong>1 full day rate</strong> if &lt;24h.
                  </li>
                  <li>
                    <strong>Insurance:</strong> <strong>$2M CGL</strong> +{" "}
                    <strong>$120,000 Rented/Leased Equipment</strong> (U-Dig It as Additional
                    Insured &amp; Loss Payee).{" "}
                    <a href="/getting-insurance/">How to get covered →</a>
                  </li>
                  <li>
                    <strong>Terms:</strong> By booking you agree to our{" "}
                    <a href="/terms-and-conditions/">Terms &amp; Conditions</a> and{" "}
                    <a href="/equipment-rider/">Equipment-Specific Rider</a>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Panel */}
            <div className="panel contact-panel" style={{ marginTop: "14px" }}>
              <h2>Contact</h2>
              <p>
                <strong>Phone:</strong> <a href="tel:+15066431575">1-506-643-1575</a> &nbsp;•&nbsp;{" "}
                <strong>Email:</strong>{" "}
                <a href="mailto:nickbaxter@udigit.ca">nickbaxter@udigit.ca</a>
              </p>
              <p>
                <strong>Address:</strong> 945 Golden Grove Road, Saint John, NB, E2H 2X1
              </p>
              <p>
                <strong>Hours:</strong> Mon–Fri, 7:00 a.m.–7:00 p.m. AST
              </p>
            </div>
          </div>
        </div>
        {/* === STICKY CTA (single source) === */}
        <div id="sticky-cta-source" className="sticky-cta" aria-hidden="true">
          <a href="#quote" className="btn primary cta-main" data-analytics="cta_sticky_quote">
            <span className="label-full">Get Availability &amp; Quote</span>
            <span className="label-short" aria-hidden="true">
              Availability
            </span>
          </a>
          <a href="tel:+15066431575" className="btn call" data-analytics="cta_sticky_call">
            Call
          </a>
          <a href="sms:+15066431575" className="btn ghost" data-analytics="cta_sticky_text">
            Text
          </a>
        </div>
      </section>{" "}
      {/* ✅ properly close the main section */}
      {/* Schema.org JSON-LD (LocalBusiness) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "U-Dig It Rentals Inc.",
            url: "https://udigit.ca/",
            telephone: "+1-506-643-1575",
            image: "https://udigit.ca/wp-content/uploads/logo.png",
            address: {
              "@type": "PostalAddress",
              streetAddress: "945 Golden Grove Road",
              addressLocality: "Saint John",
              addressRegion: "NB",
              postalCode: "E2H 2X1",
              addressCountry: "CA",
            },
            areaServed: ["Saint John", "Rothesay", "Quispamsis", "Grand Bay-Westfield", "Hampton"],
            openingHours: "Mo-Fr 07:00-19:00",
          }),
        }}
      ></script>
      {/* Schema.org JSON-LD (Service) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Skid Steer Rental (Kubota SVL-75-3)",
            provider: {
              "@type": "LocalBusiness",
              name: "U-Dig It Rentals Inc.",
            },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Saint John, New Brunswick",
            },
            serviceType: "Heavy Equipment Rental",
            termsOfService: "https://udigit.ca/terms-and-conditions/",
          }),
        }}
      ></script>
    </>
  );
}
