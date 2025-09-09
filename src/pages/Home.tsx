import React from "react";
import "../styles/udig.css";

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <div className="hero">
        <div className="container">
          <div className="grid">
            <div className="stack">
              <div className="kicker">We drop it. U-Dig It.</div>
              <h1>Rent a Pro-Grade Skid Steer in Saint John — Fast Delivery, Zero Hassle</h1>
              <p>
                Book a <strong>Kubota SVL-75-3</strong>. Flexible availability, quick orientation at
                drop-off, and transparent pricing. Homeowners and contractors welcome.
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

            <div className="hero-card">
              <h2>Quick Availability Check</h2>
              <p>Send your dates and get a fast text/email back.</p>
              <form className="mini-quote">
                <div className="row">
                  <input required name="name" placeholder="Name" />
                  <input required name="phone" placeholder="Phone" />
                  <input required name="email" type="email" placeholder="Email" />
                </div>
                <div className="row">
                  <input name="start" type="date" />
                  <input name="end" type="date" />
                  <input name="address" placeholder="Job Site Address" />
                  <select name="timeline">
                    <option value="ASAP">Timeline: ASAP</option>
                    <option>1–2 weeks</option>
                    <option>2–4 weeks</option>
                    <option>Planning</option>
                  </select>
                </div>
                <div className="cta-row">
                  <button className="btn primary" type="submit">
                    Request Quote
                  </button>
                  <a className="btn ghost" href="sms:+15066431575">
                    Text Us Instead
                  </a>
                  <a className="btn ghost" href="/rent-now/">
                    Open Full Booking Form
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BENEFITS ===== */}
      <div className="section benefits">
        <div className="container">
          <h2>Why Book With U-Dig It</h2>
          <div className="cards">
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

      {/* ===== PRICING ===== */}
      <div id="pricing" className="section pricing">
        <div className="container">
          <h2>Simple Rates, Clear Inclusions</h2>
          <div className="tiers">
            <div className="tier">
              <h3>Daily</h3>
              <div className="price">
                <span className="now">$449</span>
                <span className="was">$500</span>
                <span className="per">≈ /day</span>
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
              <span className="fineprint">Taxes, deposit, float & insurance apply.</span>
              <a className="btn primary" href="#quote">
                Book 1 Day
              </a>
            </div>

            <div className="tier popular">
              <h3>Long Weekend</h3>
              <div className="price">
                <span className="now">$1,500</span>
                <span className="per">≈ /day</span>
              </div>
              <span className="note">
                Pay 3 days, get One <strong>FREE</strong>
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
              <span className="fineprint">Taxes, deposit, float & insurance apply.</span>
              <a className="btn primary" href="#quote">
                Lock My Weekend
              </a>
            </div>

            <div className="tier">
              <h3>Weekly</h3>
              <div className="price">
                <span className="now">$2,500</span>
                <span className="per">≈ /day</span>
              </div>
              <span className="note">Best value for projects</span>
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
              <span className="fineprint">Taxes, deposit, float & insurance apply.</span>
              <a className="btn primary" href="#quote">
                Reserve My Week
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROCESS ===== */}
      <div className="section process">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <strong>Check availability</strong>
              <p>Tell us your dates and attachments. We confirm quickly.</p>
            </div>
            <div className="step">
              <strong>Insurance</strong>
              <p>Get a same-day binder from your broker (we’ll guide you).</p>
            </div>
            <div className="step">
              <strong>Delivery & orientation</strong>
              <p>We float to site and walk you through safe operation.</p>
            </div>
            <div className="step">
              <strong>Do the work</strong>
              <p>Our checklists help you stay safe and productive.</p>
            </div>
            <div className="step">
              <strong>Return</strong>
              <p>Park safe, cool down, remove key. We’ll handle pickup.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DELIVERY ===== */}
      <div id="delivery" className="section delivery">
        <div className="container">
          <h2>Delivery & Service Area</h2>
          <p className="muted">
            Flat float ($150/way) includes up to <strong>30 km</strong> from our yard. Beyond billed
            at $3/km.
          </p>
          <p>Prefer pickup? Ask about self-haul requirements.</p>
          <a
            href="https://www.google.com/maps/place/945+Golden+Grove+Rd,+Saint+John,+NB"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* ===== INSURANCE ===== */}
      <div id="insurance" className="section insurance">
        <div className="container">
          <h2>Insurance Made Simple</h2>
          <p>
            Required: <strong>$2M CGL</strong> + <strong>$120,000 rented equipment coverage</strong>
            . <a href="/getting-insurance/">See guide</a>.
          </p>
          <div className="cards">
            <div className="card">
              <div className="broker-name">John Walker Insurance</div>
              <div className="contact-row">
                <a href="tel:+15066331990">1-506-633-1990</a>
              </div>
            </div>
            <div className="card">
              <div className="broker-name">Mitchell McConnell Insurance</div>
              <div className="contact-row">
                <a href="tel:+15066347200">1-506-634-7200</a>
              </div>
            </div>
            <div className="card">
              <div className="broker-name">BrokerLink</div>
              <div className="contact-row">
                <a href="tel:+15066350760">1-506-635-0760</a>
              </div>
            </div>
            <div className="card">
              <div className="broker-name">Higgins Insurance</div>
              <div className="contact-row">
                <a href="tel:+15068497800">1-506-849-7800</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== GALLERY ===== */}
      <div className="section gallery">
        <div className="container">
          <h2>Before & After</h2>
          <div className="ba-grid">
            <figure className="ba">
              <img
                className="ba-after"
                src="https://udigit.ca/wp-content/uploads/2025/08/2-1.png"
                alt="After"
              />
              <img
                className="ba-before"
                src="https://udigit.ca/wp-content/uploads/2025/08/drivewaybefore.png"
                alt="Before"
              />
              <input className="ba-slider" type="range" />
            </figure>
            <figure className="ba">
              <img
                className="ba-after"
                src="https://udigit.ca/wp-content/uploads/2025/08/After-1.png"
                alt="After"
              />
              <img
                className="ba-before"
                src="https://udigit.ca/wp-content/uploads/2025/08/before-2.png"
                alt="Before"
              />
              <input className="ba-slider" type="range" />
            </figure>
          </div>
        </div>
      </div>

      {/* ===== PROMISES ===== */}
      <div className="section trust">
        <div className="container">
          <h2>Our Promises & Standards</h2>
          <div className="cards">
            <div className="card">
              <h3>Clear Pricing</h3>
              <ul className="checklist">
                <li>No hidden fees.</li>
                <li>Float itemized.</li>
                <li>Fuel & cleaning upfront.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Safety First</h3>
              <ul className="checklist">
                <li>Orientation at delivery.</li>
                <li>CSA PPE guidance.</li>
                <li>Support by phone/text.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Insurance Made Simple</h3>
              <ul className="checklist">
                <li>$2M CGL + $120k coverage.</li>
                <li>Template provided.</li>
                <li>COI verified before release.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA BAND ===== */}
      <div className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to lock in your dates?</h2>
            <a className="btn primary" href="#quote">
              Get Availability & Quote
            </a>
          </div>
        </div>
      </div>

      {/* ===== FAQ ===== */}
      <div id="faq" className="section">
        <div className="container">
          <h2>Top Questions</h2>
          <div className="cards">
            <div className="card">
              <h3>Who can rent?</h3>
              <p>Adults 21+ with ID, training, insurance, and deposit.</p>
            </div>
            <div className="card">
              <h3>Do I need insurance?</h3>
              <p>Yes — $2M CGL + $120,000 rented equipment.</p>
            </div>
            <div className="card">
              <h3>Delivery?</h3>
              <p>Yes — local float available from $150/way.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUOTE ===== */}
      <div id="quote" className="section">
        <div className="container">
          <div className="panel">
            <h2>Get Availability & Quote</h2>
            <form className="mini-quote">
              <div className="row">
                <input placeholder="Name" />
                <input placeholder="Phone" />
                <input placeholder="Email" />
              </div>
            </form>
          </div>
          <div className="panel contact-panel">
            <h2>Contact</h2>
            <p>
              <strong>Phone:</strong> 1-506-643-1575
            </p>
            <p>
              <strong>Email:</strong> nickbaxter@udigit.ca
            </p>
            <p>
              <strong>Address:</strong> 945 Golden Grove Road, Saint John, NB
            </p>
          </div>
        </div>
      </div>

      {/* ===== STICKY CTA ===== */}
      <div id="sticky-cta-source" className="sticky-cta">
        <a href="#quote" className="btn primary">
          Get Availability & Quote
        </a>
        <a href="tel:+15066431575" className="btn call">
          Call
        </a>
        <a href="sms:+15066431575" className="btn ghost">
          Text
        </a>
      </div>
    </>
  );
}
