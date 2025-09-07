import React from "react";
import '../styles/mdig.css';

export default function Home() {
  return (
    <section className="udig-home" data-component="udig-home">
      {/... existing content above ... }

      {/* === STICKY CTA (single source) === */}
      <div id="sticky-cta-source" className="sticky-cta" aria-hidden="true">
        <a
          href="#quote"
          className="btn primary cta-main"
          data-analytics="cta_sticky_quote"
        >
          <span className="label-full">Get Availability &amp; Quote</span>
          <span className="label-short" aria-hidden="true">Availability</span>
        </a>
        <a
          href="tel:+15066431575"
          className="btn call"
          data-analytics="cta_sticky_call"
          aria-label="Call U-Dig It Rentals"
        >
          Call
        </a>
        <a
          href="sms:+15066431575"
          className="btn ghost"
          data-analytics="cta_sticky_text"
          aria-label="Text U-Dig It Rentals"
        >
          Text
        </a>
      </div>

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
      }></script>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML>{{
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
      }></script>
    </section>
  );
}