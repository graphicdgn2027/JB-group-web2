import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import BusinessMegaMenu from "./BusinessMegaMenu";
import { useLocation } from "react-router";

const Header = () => {
  const location = useLocation();
  const [isBusinessesOpen, setIsBusinessesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsBusinessesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isDark = theme === "dark";

  const navItems = [
    { type: "link", name: "Home", path: "/" },
    { type: "link", name: "About", path: "/about" },
    { type: "dropdown", name: "Businesses" },
    { type: "link", name: "Journey", path: "/#journey" },
    { type: "link", name: "Brand & Business Partner", path: "/#brands" },
    { type: "link", name: "Leadership", path: "/leadership" },
  ];

  return (
    <header ref={headerRef} className="w-full fixed top-0 z-50">
      {/* Main Nav */}
      <div
        className={`w-full flex justify-between items-center px-8 py-4 transition-all duration-500 ${
          scrolled
            ? isDark
              ? "bg-brand-blue/95 backdrop-blur-xl shadow-lg shadow-black/20"
              : "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <a href="/" className="flex items-center ml-8 md:ml-16 lg:ml-24 transition-all duration-500">
            <Logo variant={isDark || !scrolled ? "dark" : "light"} />
          </a>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center gap-0.5 xl:gap-1 items-center text-sm font-medium">
          {navItems.map((item, idx) => (
            item.type === "dropdown" ? (
              <button
                key={idx}
                onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
                className={`flex items-center gap-1 px-2 xl:px-4 py-2 rounded-lg transition-all relative group whitespace-nowrap ${
                  isBusinessesOpen
                    ? "text-brand-red"
                    : isDark || !scrolled
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-brand-blue/70 hover:text-brand-blue hover:bg-black/5"
                }`}
              >
                Businesses
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isBusinessesOpen ? "rotate-180" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-red transition-all duration-300 ${
                    isBusinessesOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            ) : (
              <a
                key={idx}
                href={item.path}
                className={`px-2 xl:px-4 py-2 rounded-lg transition-all relative group whitespace-nowrap ${
                  location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                    ? "text-brand-red"
                    : isDark || !scrolled
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-brand-blue/70 hover:text-brand-blue hover:bg-black/5"
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-red transition-all duration-300 ${
                  location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`} />
              </a>
            )
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-2 pr-8 md:pr-16 lg:pr-24">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark || !scrolled
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-brand-blue/70 hover:text-brand-blue hover:bg-black/5"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            className={`p-2 rounded-lg transition ${
              isDark || !scrolled
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-brand-blue/70 hover:text-brand-blue hover:bg-black/5"
            }`}
          >
            <Search size={18} />
          </button>
          <a
            href="/contact"
            className="bg-brand-blue text-white hover:bg-brand-red hover:text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:-translate-y-0.5 border border-transparent ml-2"
          >
            Contact
          </a>
        </div>

        {/* Mobile Right Icons */}
        <div className="lg:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-lg transition ${
                isDark || !scrolled
                  ? "text-white hover:bg-white/10"
                  : "text-brand-blue hover:bg-black/5"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-lg transition ${
              isDark || !scrolled
                ? "text-white hover:bg-white/10"
                : "text-brand-blue hover:bg-black/5"
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`lg:hidden backdrop-blur-xl border-t px-8 py-6 space-y-2 ${
            isDark
              ? "bg-brand-blue/95 border-white/10"
              : "bg-white/95 border-gray-200"
          }`}
        >
          {navItems.map((item, idx) => (
            item.type === "dropdown" ? (
              <button
                key={idx}
                onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
                className={`w-full text-left py-3 px-4 rounded-lg transition flex items-center justify-between ${
                  isDark
                    ? "text-white/80 hover:text-white hover:bg-white/5"
                    : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5"
                }`}
              >
                Businesses
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isBusinessesOpen ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <a
                key={idx}
                href={item.path}
                className={`block py-3 px-4 rounded-lg transition ${
                  location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                    ? "text-brand-red font-semibold bg-black/5"
                    : isDark
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </a>
            )
          ))}
          <a
            href="/contact"
            className="block mt-4 text-center bg-brand-blue text-white hover:bg-brand-red hover:text-white px-6 py-3 font-bold transition-all duration-300 shadow-lg border border-transparent"
          >
            Contact
          </a>
        </div>
      )}

      <BusinessMegaMenu isOpen={isBusinessesOpen} />
    </header>
  );
};

export default Header;
