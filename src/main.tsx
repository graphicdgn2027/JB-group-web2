import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import PortfolioDetails from "./pages/PortfolioDetails.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import LeadershipPage from "./pages/LeadershipPage.tsx";
import BrandPartnersPage from "./pages/BrandPartnersPage.tsx";
import { ContentProvider } from "./content/ContentProvider.tsx";
import { AuthProvider } from "./dashboard/AuthProvider.tsx";
import DashboardLayout from "./dashboard/DashboardLayout.tsx";
import OverviewPage from "./dashboard/pages/OverviewPage.tsx";
import HeroEditor from "./dashboard/pages/HeroEditor.tsx";
import AboutHomeEditor from "./dashboard/pages/AboutHomeEditor.tsx";
import PurposeEditor from "./dashboard/pages/PurposeEditor.tsx";
import BusinessesEditor from "./dashboard/pages/BusinessesEditor.tsx";
import LeadershipEditor from "./dashboard/pages/LeadershipEditor.tsx";
import AboutPageEditor from "./dashboard/pages/AboutPageEditor.tsx";
import TimelineEditor from "./dashboard/pages/TimelineEditor.tsx";
import BrandPartnersEditor from "./dashboard/pages/BrandPartnersEditor.tsx";
import ContactEditor from "./dashboard/pages/ContactEditor.tsx";
import FooterNavEditor from "./dashboard/pages/FooterNavEditor.tsx";
import MediaPage from "./dashboard/pages/MediaPage.tsx";
import SettingsEditor from "./dashboard/pages/SettingsEditor.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <ContentProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public website */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio/:id" element={<PortfolioDetails />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/brand-partners" element={<BrandPartnersPage />} />

            {/* Admin dashboard — DashboardLayout renders the login screen
                itself when there is no authenticated session. */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="about-home" element={<AboutHomeEditor />} />
              <Route path="purpose" element={<PurposeEditor />} />
              <Route path="businesses" element={<BusinessesEditor />} />
              <Route path="leadership" element={<LeadershipEditor />} />
              <Route path="about-page" element={<AboutPageEditor />} />
              <Route path="timeline" element={<TimelineEditor />} />
              <Route path="brand-partners" element={<BrandPartnersEditor />} />
              <Route path="contact" element={<ContactEditor />} />
              <Route path="footer" element={<FooterNavEditor />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="settings" element={<SettingsEditor />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ContentProvider>
  </ThemeProvider>
);
