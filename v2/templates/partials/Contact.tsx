import React from "react";
import Layout from "../partials/Layout.js";

export default function Contact() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <p className="mt-4 text-gray-700">
        Have questions or want to collaborate? Reach out and we’ll get back to you.
      </p>
      <form className="mt-6 max-w-md">
        <label className="mb-2 block font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="mb-4 w-full rounded border p-2"
          placeholder="Your name"
        />

        <label className="mb-2 block font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mb-4 w-full rounded border p-2"
          placeholder="you@example.com"
        />

        <label className="mb-2 block font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          className="mb-4 w-full rounded border p-2"
          rows={4}
          placeholder="Type your message here..."
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </Layout>
  );
}