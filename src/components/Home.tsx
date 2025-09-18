import React from "react";
import Layout from "../components/Layout.js";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Welcome to Website OS V2</h1>
      <p className="mt-4">
        This is the home page. Navigate with the menu above to explore About and Contact pages.
      </p>
    </Layout>
  );
}
