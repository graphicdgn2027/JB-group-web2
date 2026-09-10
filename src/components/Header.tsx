import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import BusinessMegaMenu from "./BusinessMegaMenu";
import { useLocation, useNavigate } from "react-router";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Smooth scroll to hash section — works both on same page and when navigating from other pages
  const handleHashNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("/#")) {
      const hash = path.substring(1); // e.g. "#journey"
      if (location.pathname === "/") {
        // Already on home page — just smooth scroll
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // If on another page, let the normal href navigate (HomePage will handle scroll after load)
    }
    setMobileOpen(false);
  };

  const navItems = [
    { type: "link", name: "Home", path: "/" },
    { type: "link", name: "About", path: "/about" },
    { type: "dropdown", name: "Businesses" },
    { type: "link", name: "Journey", path: "/#journey" },
    { type: "link", name: "Brand & Business Partner", path: "/#brands" },
    { type: "link", name: "Leadership", path: "/leadership" },
  ];

  return (
    <header ref={headerRef} className="w-full fixed top-0 z-50 transition-all duration-500 flex justify-center">
      {/* Main Nav */}
      <div
        className={`flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? "w-[95%] md:w-[85%] lg:w-[80%] max-w-7xl py-3 px-6 mt-6 rounded-[10px] " + (isDark
              ? "bg-brand-blue/80 backdrop-blur-lg shadow-xl shadow-black/20 border border-white/10"
              : "bg-[#0A192F]/90 backdrop-blur-lg shadow-xl shadow-black/20 border border-white/10 text-white")
            : "w-full py-4 px-4 md:px-8 lg:px-[6.25vw] rounded-none bg-transparent"
        }`}
      >
        {/* Left: Logo */}
        <div className="shrink-0 flex items-center">
          <a href="/" className="flex items-center transition-all duration-500">
            <Logo variant="dark" />
          </a>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center gap-0.5 xl:gap-1 items-center text-sm font-medium px-4 overflow-hidden">
          {navItems.map((item, idx) => {
            let isActive = false;
            if (item.type === "dropdown") {
              isActive = isBusinessesOpen;
            } else if (!isBusinessesOpen) {
              if (item.path === "/") {
                isActive = location.pathname === "/" && (!location.hash || location.hash === "");
              } else if (item.path?.startsWith("/#")) {
                isActive = location.pathname === "/" && location.hash === item.path.substring(1);
              } else {
                isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path as string));
              }
            }

            return item.type === "dropdown" ? (
              <button
                key={idx}
                onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
                className={`flex items-center gap-1 px-2 xl:px-4 py-2  transition-all relative group whitespace-nowrap ${
                  isActive
                    ? "text-brand-red"
                    : "text-white/80 hover:text-white hover:bg-white/10"
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
                key={idx}
                href={item.path}
                onClick={(e) => handleHashNav(e, item.path as string)}
                className={`px-2 xl:px-4 py-2  transition-all relative group whitespace-nowrap ${
                  isActive
                    ? "text-brand-red"
                    : "text-white/80 hover:text-white hover:bg-white/10"
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
              className="p-2 transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            className="p-2 transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Search size={18} />
          </button>
          <a
            href="/contact"
            className="bg-brand-blue text-white hover:bg-brand-red hover:text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:-translate-y-0.5 border border-white/20 ml-2"
          >
            Contact
          </a>
        </div>

        {/* Mobile Right Icons */}
        <div className="lg:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 transition text-white hover:bg-white/10 rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 transition text-white hover:bg-white/10 rounded-full"
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
                className={`w-full text-left py-3 px-4  transition flex items-center justify-between ${
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
                className={`block py-3 px-4  transition ${
                  location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
                    ? "text-brand-red font-semibold bg-black/5"
                    : isDark
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-brand-blue/80 hover:text-brand-blue hover:bg-black/5"
                }`}
                onClick={(e) => handleHashNav(e, item.path as string)}
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
