import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Navigate, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import PortfolioDetails from "./pages/PortfolioDetails.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import LeadershipPage from "./pages/LeadershipPage.tsx";
import BrandPartnersPage from "./pages/BrandPartnersPage.tsx";
import { ContentProvider } from "./content/ContentProvider.tsx";
import RedirectOrNotFound from "./pages/RedirectOrNotFound.tsx";
import "./styles/index.css";

/**
 * Everything below is admin-only and lazily loaded. Imported directly it all
 * lands in the entry bundle, so every visitor to the public site downloads the
 * whole CMS — eighteen editor screens, the media library and the Supabase
 * client — before the homepage can paint. Behind lazy() it is a separate chunk
 * that only someone opening /dashboard ever fetches.
 */
const AuthProvider = lazy(() =>
  import("./dashboard/AuthProvider.tsx").then((m) => ({ default: m.AuthProvider }))
);
const DashboardLayout = lazy(() => import("./dashboard/DashboardLayout.tsx"));
const OverviewPage = lazy(() => import("./dashboard/pages/OverviewPage.tsx"));
const HeroEditor = lazy(() => import("./dashboard/pages/HeroEditor.tsx"));
const AboutHomeEditor = lazy(() => import("./dashboard/pages/AboutHomeEditor.tsx"));
const PurposeEditor = lazy(() => import("./dashboard/pages/PurposeEditor.tsx"));
const BusinessesEditor = lazy(() => import("./dashboard/pages/BusinessesEditor.tsx"));
const LeadershipEditor = lazy(() => import("./dashboard/pages/LeadershipEditor.tsx"));
const AboutPageEditor = lazy(() => import("./dashboard/pages/AboutPageEditor.tsx"));
const TimelineEditor = lazy(() => import("./dashboard/pages/TimelineEditor.tsx"));
const BrandPartnersEditor = lazy(() => import("./dashboard/pages/BrandPartnersEditor.tsx"));
const ContactEditor = lazy(() => import("./dashboard/pages/ContactEditor.tsx"));
const FooterNavEditor = lazy(() => import("./dashboard/pages/FooterNavEditor.tsx"));
const MediaPage = lazy(() => import("./dashboard/pages/MediaPage.tsx"));
const SettingsEditor = lazy(() => import("./dashboard/pages/SettingsEditor.tsx"));
const ReviewPage = lazy(() => import("./dashboard/pages/ReviewPage.tsx"));
const UsersPage = lazy(() => import("./dashboard/pages/UsersPage.tsx"));
const RolesPage = lazy(() => import("./dashboard/pages/RolesPage.tsx"));
const ActivityPage = lazy(() => import("./dashboard/pages/ActivityPage.tsx"));
const AccountPage = lazy(() => import("./dashboard/pages/AccountPage.tsx"));
const BlogListEditor = lazy(() => import("./dashboard/pages/BlogListEditor.tsx"));
const BlogPostEditor = lazy(() => import("./dashboard/pages/BlogPostEditor.tsx"));
const SeoEditor = lazy(() => import("./dashboard/pages/SeoEditor.tsx"));
const InboxPage = lazy(() => import("./dashboard/pages/InboxPage.tsx"));

// Blog pages carry the HTML sanitiser, so they load on demand too.
const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage.tsx"));

const PublicFallback = () => <div className="min-h-[100dvh] bg-background" />;

/** Shown only while an admin chunk is in flight — never on the public site. */
const DashboardFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
    Loading…
  </div>
);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio/:id" element={<PortfolioDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/brand-partners" element={<BrandPartnersPage />} />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<PublicFallback />}>
                <BlogPage />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={<PublicFallback />}>
                <BlogPostPage />
              </Suspense>
            }
          />
          {/* "Our Businesses" links point here; the section lives on the homepage. */}
          <Route path="/businesses" element={<Navigate to="/#businesses" replace />} />

          {/* Admin dashboard — DashboardLayout renders the login screen
              itself when there is no authenticated session. AuthProvider sits
              inside the lazy boundary so its Supabase import is admin-only. */}
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<DashboardFallback />}>
                <AuthProvider>
                  <DashboardLayout />
                </AuthProvider>
              </Suspense>
            }
          >
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
            <Route path="blog" element={<BlogListEditor />} />
            <Route path="blog/:postId" element={<BlogPostEditor />} />
            <Route path="seo" element={<SeoEditor />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="settings" element={<SettingsEditor />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* Anything else: an SEO redirect from the dashboard, or a 404. */}
          <Route path="*" element={<RedirectOrNotFound />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  </ThemeProvider>
);
