import React from "react";
import Layout from "./Layout"; // ✅ fixed import, removed .js extension

export default function Home() {
  return (
    <Layout>
      <h1>Welcome to Home</h1>
    </Layout>
  );
}