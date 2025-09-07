import React from "react";

export default function Contact() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sage px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-extrabold md:text-5xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-amber-100">
          We’d love to hear from you. Reach out for demos, questions, or partnerships.
        </p>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <form className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
          <div>
            <label className="block font-semibold text-slate-700">Name</label>
            <input
              type="text"
              className="mt-2 w-full rounded-md border p-3 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-md border p-3 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700">Message</label>
            <textarea
              className="mt-2 w-full rounded-md border p-3 focus:ring-2 focus:ring-amber-400"
              rows={5}
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
