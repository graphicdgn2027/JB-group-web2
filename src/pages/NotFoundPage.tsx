import React, { useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { useSection } from "../content/ContentProvider";

/** Shown for any URL that matches no route, so a mistyped link never renders a blank page. */
const NotFoundPage: React.FC = () => {
  const nav = useSection("nav");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-32 pt-40">
        <div className="max-w-xl text-center">
          <p className="text-[110px] md:text-[150px] font-black leading-none tracking-tight text-brand-blue/10 dark:text-white/10 select-none">
            404
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-brand-blue dark:text-white">
            This page could not be found.
          </h1>
          <p className="mt-4 text-muted-foreground font-light leading-relaxed">
            The page you are looking for may have been moved or removed. You can head back to the
            homepage or use the menu to find what you need.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent hover:text-brand-blue"
            >
              <Home size={16} />
              Homepage
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-blue transition-colors hover:border-accent hover:text-accent dark:text-white"
            >
              <ArrowLeft size={16} />
              Go back
            </button>
          </div>

          {nav.items.length > 0 && (
            <div className="mt-12 border-t border-border/60 pt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Popular pages
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {nav.items.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="text-sm font-medium text-brand-blue hover:text-accent transition-colors dark:text-white/80 dark:hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ContactFooter />
    </div>
  );
};

export default NotFoundPage;
