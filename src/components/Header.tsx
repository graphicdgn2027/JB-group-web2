import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import BusinessMegaMenu from "./BusinessMegaMenu";
import { useLocation } from "react-router";
import { useSection, usePublishedBusinesses } from "../content/ContentProvider";
import { resolveIcon } from "../content/icons";

/** The Businesses dropdown is generated, so it sits at a fixed slot in the menu. */
const DROPDOWN_INDEX = 2;

type NavEntry =
  | { type: "dropdown"; key: string }
  | { type: "link"; key: string; name: string; path: string };

const Header = () => {
  const location = useLocation();
  const [isBusinessesOpen, setIsBusinessesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const nav = useSection("nav");
  const businesses = usePublishedBusinesses();

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsBusinessesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isDark = theme === "dark";

  // Smooth scroll to hash section — works both on same page and when navigating from other pages
  const handleHashNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    const hashIndex = path.indexOf("#");
    if (hashIndex !== -1) {
      const pagePath = path.substring(0, hashIndex) || "/";
      const hash = path.substring(hashIndex); // e.g. "#journey"
      if (location.pathname === pagePath) {
        // Already on the target page — just smooth scroll
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // If on another page, let the normal href navigate (target page handles scroll after load)
    }
    setMobileOpen(false);
    setIsBusinessesOpen(false);
  };

  const links: NavEntry[] = nav.items.map((item) => ({
    type: "link" as const,
    key: item.id,
    name: item.label,
    path: item.href,
  }));

  const navItems: NavEntry[] = [
    ...links.slice(0, DROPDOWN_INDEX),
    { type: "dropdown", key: "businesses" },
    ...links.slice(DROPDOWN_INDEX),
  ];

  return (
    <header ref={headerRef} className="w-full fixed top-0 left-0 z-50 flex flex-wrap justify-center">
      {/* flex-wrap matters here: the nav bar and the (conditionally rendered)
          mobile menu panel are both w-full flex children — without wrap they'd
          share one row and get squeezed to ~50% width each instead of the
          menu dropping to its own full-width row below the bar. */}
      {/* Main Nav */}
      <div className="flex justify-between items-center w-full py-4 px-4 md:px-8 lg:px-[6.25vw] rounded-none bg-white dark:bg-[#0a1230] transition-colors duration-500">
        {/* Left: Logo */}
        <div className="shrink-0 flex items-center">
          <a href="/" className="flex items-center transition-all duration-500">
            <Logo variant="auto" />
          </a>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center gap-0.5 xl:gap-1 items-center text-sm font-medium px-4 overflow-hidden">
          {navItems.map((item) => {
            let isActive = false;
            if (item.type === "dropdown") {
              isActive = isBusinessesOpen;
            } else if (!isBusinessesOpen) {
              if (item.path === "/") {
                isActive = location.pathname === "/" && (!location.hash || location.hash === "");
              } else if (item.path?.startsWith("/#")) {
                isActive = location.pathname === "/" && location.hash === item.path.substring(1);
              } else {
                isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
              }
            }

            return item.type === "dropdown" ? (
              <button
                key={item.key}
                onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
                className={`flex items-center gap-1 px-2 xl:px-4 py-2 transition-all relative group whitespace-nowrap ${
                  isActive
                    ? "text-brand-red"
                    : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                Businesses
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isBusinessesOpen ? "rotate-180" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-red transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            ) : (
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => handleHashNav(e, item.path)}
                className={`px-2 xl:px-4 py-2 transition-all relative group whitespace-nowrap ${
                  isActive
                    ? "text-brand-red"
                    : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-red transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`} />
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex shrink-0 justify-end items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 transition-all duration-300 text-brand-blue/80 hover:text-brand-blue hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10 rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* Mobile Right Icons */}
        <div className="lg:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 transition text-brand-blue hover:bg-black/5 dark:text-white dark:hover:bg-white/10 rounded-full"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 transition text-brand-blue hover:bg-black/5 dark:text-white dark:hover:bg-white/10 rounded-full"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — needs an explicit width: it's a flex child of the
          justify-center <header>, so without one it shrinks to its content
          width and floats centered instead of spanning the screen. */}
      {mobileOpen && (
        <div
          className={`lg:hidden w-full backdrop-blur-xl border-t px-8 py-6 space-y-2 max-h-[calc(100vh-4.5rem)] overflow-y-auto ${
            isDark
              ? "bg-brand-blue/95 border-white/10"
              : "bg-white/95 border-gray-200"
          }`}
        >
          {navItems.map((item) => (
            item.type === "dropdown" ? (
              <div key={item.key}>
                <button
                  onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
                  aria-expanded={isBusinessesOpen}
                  className={`w-full text-left py-3 px-4  transition flex items-center justify-between ${
                    isBusinessesOpen
                      ? "text-brand-red font-semibold"
                      : isDark
                        ? "text-white/80 hover:text-white hover:bg-white/5"
                        : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5"
                  }`}
                >
                  Businesses
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isBusinessesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Businesses open inline on mobile — the desktop mega menu panel
                    is a fixed-width overlay that has nowhere to go on a phone. */}
                {isBusinessesOpen && (
                  <div className="mt-1 mb-2 space-y-1">
                    {businesses.map((business) => {
                      const Icon = resolveIcon(business.icon);
                      return (
                        <a
                          key={business.id}
                          href={`/portfolio/${business.slug}`}
                          onClick={() => {
                            setMobileOpen(false);
                            setIsBusinessesOpen(false);
                          }}
                          className={`flex items-center gap-3 py-3 pl-6 pr-4 rounded-lg transition ${
                            isDark
                              ? "text-white/75 hover:text-white hover:bg-white/5"
                              : "text-brand-blue/75 hover:text-brand-blue hover:bg-black/5"
                          }`}
                        >
                          <Icon size={18} className="shrink-0 text-brand-red" />
                          <span className="text-[15px] font-medium leading-snug">{business.title}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.key}
                href={item.path}
                className={`block py-3 px-4  transition ${
                  location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                    ? isDark
                      ? "text-brand-red font-semibold bg-white/5"
                      : "text-brand-red font-semibold bg-black/5"
                    : isDark
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5"
                }`}
                onClick={(e) => handleHashNav(e, item.path)}
              >
                {item.name}
              </a>
            )
          ))}
        </div>
      )}

      <BusinessMegaMenu isOpen={isBusinessesOpen} />
    </header>
  );
};

export default Header;
