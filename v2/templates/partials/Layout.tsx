import React from "react";
import NavigationMenu from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header>
        <NavigationMenu />
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-6">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
