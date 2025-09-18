import React from "react";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-aurora animate-aurora px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-extrabold md:text-5xl">About Website OS V2</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-amber-100">
          Cultivating digital ecosystems with speed ⚡, compliance 🔒, and beauty 🎨.
        </p>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
        <p className="leading-relaxed text-slate-600">
          Website OS V2 is built for builders, creators, and organizations who want to launch fast,
          stay compliant, and resonate with culture.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
        <p className="leading-relaxed text-slate-600">
          To be the covenant OS that empowers cultural ecosystems worldwide with fairness, beauty,
          and resilience.
        </p>
      </section>
    </div>
  );
}
