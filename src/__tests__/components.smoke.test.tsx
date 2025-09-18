import About from "../components/About";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Home from "../components/Home";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Button from "../components/ui/button";
import Card from "../components/ui/card";

test("About component loads", () => {
  expect(About).toBeDefined();
});

test("ErrorBoundary component loads", () => {
  expect(ErrorBoundary).toBeDefined();
});

test("Footer component loads", () => {
  expect(Footer).toBeDefined();
});

test("Home component loads", () => {
  expect(Home).toBeDefined();
});

test("Layout component loads", () => {
  expect(Layout).toBeDefined();
});

test("Navbar component loads", () => {
  expect(Navbar).toBeDefined();
});

test("Button component loads", () => {
  expect(Button).toBeDefined();
});

test("Card component loads", () => {
  expect(Card).toBeDefined();
});