import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import PortfolioDetails from "./pages/PortfolioDetails.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import LeadershipPage from "./pages/LeadershipPage.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetails />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);