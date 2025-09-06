import React from "react";
import Layout from "../partials/Layout";

export default function Contact() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <p className="mt-4 text-gray-700">
        Have questions or want to collaborate? Reach out and we’ll get back to you.
      </p>
      <form className="mt-6 max-w-md">
        <label className="block mb-2 font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full border rounded p-2 mb-4"
          placeholder="Your name"
        />

        <label className="block mb-2 font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full border rounded p-2 mb-4"
          placeholder="you@example.com"
        />

        <label className="block mb-2 font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Type your message here..."
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </Layout>
  );
}
