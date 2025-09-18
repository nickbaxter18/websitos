let About, ErrorBoundary, Footer, Home, Layout, Navbar, Button, Card;

try { About = require("../components/About").default; } catch (e) { console.warn("⚠️ About failed to load:", (e as Error).message); }
try { ErrorBoundary = require("../components/ErrorBoundary").default; } catch (e) { console.warn("⚠️ ErrorBoundary failed to load:", (e as Error).message); }
try { Footer = require("../components/Footer").default; } catch (e) { console.warn("⚠️ Footer failed to load:", (e as Error).message); }
try { Home = require("../components/Home").default; } catch (e) { console.warn("⚠️ Home failed to load:", (e as Error).message); }
try { Layout = require("../components/Layout").default; } catch (e) { console.warn("⚠️ Layout failed to load:", (e as Error).message); }
try { Navbar = require("../components/Navbar").default; } catch (e) { console.warn("⚠️ Navbar failed to load:", (e as Error).message); }
try { Button = require("../components/ui/button").default; } catch (e) { console.warn("⚠️ Button failed to load:", (e as Error).message); }
try { Card = require("../components/ui/card").default; } catch (e) { console.warn("⚠️ Card failed to load:", (e as Error).message); }

test("components load without crashing", () => {
  expect(About).toBeDefined();
  expect(ErrorBoundary).toBeDefined();
  expect(Footer).toBeDefined();
  expect(Home).toBeDefined();
  expect(Layout).toBeDefined();
  expect(Navbar).toBeDefined();
  expect(Button).toBeDefined();
  expect(Card).toBeDefined();
});