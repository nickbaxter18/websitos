import React from "react";

export default function Terms() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-warrior px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-extrabold md:text-5xl">Terms of Service</h1>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-16 text-slate-700">
        <h2 className="text-xl font-bold">1. Introduction</h2>
        <p>By using Website OS V2, you agree to these terms...</p>

        <h2 className="text-xl font-bold">2. Usage</h2>
        <p>You may not misuse or abuse the platform...</p>

        <h2 className="text-xl font-bold">3. Liability</h2>
        <p>Website OS is not liable for damages caused by misuse...</p>
      </section>
    </div>
  );
}
