import React from "react";

export default function Privacy() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-trickster px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-extrabold md:text-5xl">Privacy Policy</h1>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-16 text-slate-700">
        <h2 className="text-xl font-bold">1. Data Collection</h2>
        <p>We collect minimal data needed to run Website OS responsibly...</p>

        <h2 className="text-xl font-bold">2. Cookies</h2>
        <p>Cookies are used for analytics and user preferences...</p>

        <h2 className="text-xl font-bold">3. User Rights</h2>
        <p>You can request deletion of your data at any time...</p>
      </section>
    </div>
  );
}
